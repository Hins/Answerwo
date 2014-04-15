/*=============================================================================
    Copyright (c) 2012 Hins pan

    Distributed under the answerwo License, Version 1.0.
==============================================================================*/
#include <iostream>
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#include <string.h>
#include <vector>
#include <pcre.h>

using namespace std;

const char *url;
const char *upperbound;
const char *lowerbound;
const char *pattern;
const char *targetpage = "./Targetpage.html";
const size_t SIZE = 1024;
char buf[SIZE];
char file_buf[SIZE*100];
int ovector[SIZE];
FILE *fp;
int start,end;

pcre *pe;
const char *error;
int erroffset;

int CrawlerPage(const char *url) {
    sprintf(buf,"wget %s -O %s",url,targetpage);
    return system(buf);
}

int OpenFile() {
    fp = fopen(targetpage,"r");
    if(fp == NULL)
    	return -1;
    return 0;
}

int CloseFile() {
    fclose(fp);
    return 0;
}

int ParseUrls(vector<string> &v) {
    if(OpenFile()) {
	printf("Open file failed!\n");
	return -10;
    }
    fseek(fp,0,SEEK_END);  
    long size = ftell(fp);
    fseek(fp,0,SEEK_SET);
    size_t result = fread(file_buf,1,size,fp);  
    if(result != size) {
    	printf("Read file failed!\n");
    	return -1;
    }
    string str = file_buf;
    start = str.find(upperbound,0);
    if(start == string::npos) {
    	printf("start position can't be found!\n");
	return -2;
    }
    start += strlen(upperbound);
    end = str.find(lowerbound,start);
    if(end == string::npos) {
    	printf("end position can't be found!\n");
	return -3;
    }
    str = str.substr(start+11,end-start-11);
    pe = pcre_compile(pattern,0,&error,&erroffset,NULL);
    if(pe == NULL) {
        printf("PCRE compilation failed at offset %d: %s\n", erroffset, error);
        return -4;
    }
    start = 0;
    while(result >= 0 && start < str.length()) {
        result = pcre_exec(pe,NULL,str.c_str(),str.length(),start,0,ovector,SIZE);
	for(int i = 0; i < result; i++) {
            sprintf(buf,"wget -t 2 -T 30 -S -Y on -e \"http_proxy=%s\" http://czdl.cooco.net.cn/testdetail/9861/ -O ./9861.html", str.substr(ovector[2*i],ovector[2*i+1]-ovector[2*i]).c_str());
	    system(buf);
        }
	if(result > 0)
	    start = ovector[2*(result-1)+1]+1;
    }
    free(pe);
    CloseFile();
    return 0;
}

int main(int argc, char *argv[])
{
    if(argc < 5) {
    	printf("Format: ProxyIps_Parse url upperllound lowerbound pattern\n");
	return 1;
    }
    url = argv[1];
    upperbound = argv[2];
    lowerbound = argv[3];
    pattern = argv[4];

    CrawlerPage(url);
    vector<string> v;
    ParseUrls(v);   
    return 0;
}