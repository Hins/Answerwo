/*=============================================================================
    Copyright (c) 2012 Hins pan

    Distributed under the answerwo License, Version 1.0.
==============================================================================*/
#include <iostream>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <vector>
#include <sys/stat.h>
#include <unistd.h>
#include <dirent.h>
#include <pthread.h>

using namespace std;

//#define DEBUG
#define FORMAT_ERROR -1
#define CREATE_THREAD_FAIL -2
#define INIT_THREAD_ATTR_FAIL -3
#define SET_THREAD_DETACH_ATTR_FAIL -4
#define NO_ERROR 0

const size_t FILES = 10;  //should be read from configuration files;
const size_t SIZE = 256;
int g_thread_finished = 0;

void *thread_crawler(void *arg)
{
    DIR *dir;
    struct dirent* ddir;
    struct stat fbuf;
    char buf[SIZE];
    string sip;
    string scom;
    int start,end,cnt;
    int i,j;

    FILE * fip = fopen((const char *)(((void**)arg)[0]),"r");
    #ifdef DEBUG
    pid_t pid;
    pid = getpid();
    pthread_t thread_id;
    thread_id = pthread_self();
    printf("pid: %u\ntid: %u\nfile: %s\nsave_path: %s\nurl_list_file: %s\n\n",(unsigned int)pid,(unsigned int)thread_id,(const char *)(((void**)arg)[0]),(const char *)(((void**)arg)[2]),(const char *)(((void**)arg)[1]));
    #endif
    #ifndef DEBUG
    while(fgets(buf,SIZE,fip) != NULL) {
        sip = buf;
        sip = sip.substr(0,sip.length()-1);
        cnt = 0;
        FILE * fcourse = fopen((const char *)(((void**)arg)[1]),"r");
        while(fgets(buf,SIZE,fcourse) != NULL) {
           scom = buf;
           scom = scom.substr(0,scom.length()-1);
	   start = scom.find("-O ");
	   if(!access(scom.substr(start+3,scom.length()-start-3).c_str(),R_OK)) {
	       continue;
	   }
           if(scom.find("http_proxy=") != string::npos) {
              start = scom.find("http_proxy=");
              end = scom.find("\"",start+11);
              scom.replace(start+11,end-start-11,sip);
              system(scom.c_str());
           }
	   start = scom.find("-O ");
	   stat(scom.substr(start+3,scom.length()-start-3).c_str(),&fbuf);
	   if(!fbuf.st_size) {
	       sprintf(buf,"rm -rf %s",scom.substr(start+3,scom.length()-start-3).c_str());
	       system(buf);
	       break;
	   }
        }
        fclose(fcourse);
    }
    #endif
    fclose(fip);
    g_thread_finished++;
    pthread_exit(NULL);
}

int Direct_proxy_crawler(const char *url_path, const char *proxy_path)
{
    int start = 0, end = 0;
    string str,sip;
    struct stat fbuf;
    char buf[SIZE];
    FILE *fip = fopen(proxy_path,"r");
    while(fgets(buf,SIZE,fip) != NULL) {
	sip = buf;
	sip = sip.substr(0,sip.length()-1);
	FILE *fp = fopen(url_path,"r");
        while(fgets(buf,SIZE,fp) != NULL) {
	    str = buf;
	    str = str.substr(0,str.length()-1);
	    start = str.find("-O ");
	    if(!access(str.substr(start+3,str.length()-start-3).c_str(),R_OK)) {
                continue;
            }
	    if(str.find("http_proxy=") != string::npos) {
                start = str.find("http_proxy=");
                end = str.find("\"",start+11);
                str.replace(start+11,end-start-11,sip);
                system(str.c_str());
            }
	    start = str.find("-O ");
            stat(str.substr(start+3,str.length()-start-3).c_str(),&fbuf);
            if(!fbuf.st_size) {
                sprintf(buf,"rm -rf %s",str.substr(start+3,str.length()-start-3).c_str());
                system(buf);
                break;
            }
	}
	fclose(fp);
    }
    fclose(fip);
    return NO_ERROR;
}

int Direct_crawler(const char *url_path, const char *save_path)
{
    string str;
    char buf[SIZE];
    FILE *fp = fopen(url_path,"r");
    while(fgets(buf,SIZE,fp) != NULL) {
    	str = buf;
	sprintf(buf,"wget -nc -t 2 -T 30 %s -O %s",str.c_str(),save_path);
	system(buf);
    }
    return NO_ERROR;
}

int SE_crawler(const char *url_path, const char *save_path)
{
    string str;
    char buf[SIZE];
    FILE *fp = fopen(url_path,"r");
    while(fgets(buf,SIZE,fp) != NULL) {
    	str = buf;
        sprintf(buf,"wget -nc -t 2 -T 30 -U baiduspider %s -O %s",str.c_str(),save_path);
	system(buf);
    }
    return NO_ERROR;
}

void print_help()
{
    printf("Proxy crawler: crawler proxy_ip_files_path urls_file_path save_path\n");
    printf("Direct proxy crawler: crawler -dp proxy_ip_files_path urls_file_path\n");
    printf("Direct crawler: crawler -d urls_file_path save_path\n");
    printf("Search engine crawler: crawler -se urls_file_path save_path\n");
}

int main(int argc,char *argv[])
{
    if(argc < 3) {
    	print_help();
	return FORMAT_ERROR;
    }

    DIR *dir;
    struct dirent* ddir;
    struct stat fbuf;
    int err,i; 
    char buf[SIZE];
    vector<string> v;
    string str;

    if(!strcmp(argv[1],"-dp")) {
	return Direct_proxy_crawler(argv[3],argv[2]);
    }

    if(!strcmp(argv[1],"-d")) {
        return Direct_crawler(argv[2],argv[3]);
    }

    if(!strcmp(argv[1],"-se")) {
        return SE_crawler(argv[2],argv[3]);
    }

    dir = opendir(argv[2]);
    while((ddir=readdir(dir)) != NULL) {
	if((strcmp(ddir->d_name,".")==0) || (strcmp(ddir->d_name,"..")==0))
                continue;
	sprintf(buf,"%s%s",argv[2],ddir->d_name);
	str = buf;
	v.push_back(str);
    }


    dir = opendir(argv[1]);
    i = 0;
    while((ddir=readdir(dir)) != NULL) {
        if((strcmp(ddir->d_name,".")==0) || (strcmp(ddir->d_name,"..")==0))
                continue;
	sprintf(buf,"%s%s",argv[1],ddir->d_name);
	void *arg[3] = {buf,(void*)v[i].c_str(),argv[3]};

    	pthread_t tid;
	err = pthread_create(&tid,NULL,thread_crawler,arg);
	if(err != 0) {
	    printf("can't create thread: %s\n",strerror(err));
	    return CREATE_THREAD_FAIL;
	}
	i++;
	sleep(1); //wait for thread creation, avoid arg variable covered;
    }

    //wait for children threads;
    while(g_thread_finished != FILES) {
    }

    return 0;
}

