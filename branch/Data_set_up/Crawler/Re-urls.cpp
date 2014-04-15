#include <iostream>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>

using namespace std;
#define FORMAT_ERROR -1
#define NO_ERROR 0

void M1_Parse(const char *file_path,const char * new_file_path) {
    FILE * fp = fopen(file_path,"r");
    FILE * fp2 = fopen(new_file_path,"w");
    char buf[1024];
    while(fgets(buf,1024,fp)) {
	string str = buf;
	fprintf(fp2,"wget -nc -T 30 -t 2 -Y on -e \"http_proxy=123.125.156.201:80\" http://gzdl.cooco.net.cn/testdetail/%s/ -O ./gzdl/%s",str.substr(0,str.find(".")).c_str(),str.c_str());
    }
    fclose(fp);
    fflush(fp2);
    fclose(fp2);
};

int main(int argc,char *argv[])
{
    if(argc < 3) {
        printf("Format: Re-urls urls_file_path output_file_path\n");
	printf("Format: Re-urls -m1 src_file_path new_file_path\n");
        return FORMAT_ERROR;
    }
    if(!strcmp(argv[1],"-m1")) {
	M1_Parse(argv[2],argv[3]);
    }
    else {
    FILE *fp = fopen(argv[1],"r");
    FILE *fp2 = fopen(argv[2],"a");
    const size_t SIZE = 1024;
    char buf[SIZE];
    string str,sub_str;
    int start = 0;
    while(fgets(buf,SIZE,fp) != NULL) {
        str = buf;
	start = str.find("-O ");
	if(start != string::npos) {
	    sub_str = str.substr(start+3,str.length()-start-4);
	    if(access(sub_str.c_str(),R_OK) != 0) {
	    	fprintf(fp2,"%s",str.c_str());
	    }
	}
    }
    fclose(fp);
    fflush(fp2);
    fclose(fp2);
    }
    return NO_ERROR;
}
