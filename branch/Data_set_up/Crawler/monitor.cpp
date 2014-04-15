/*=============================================================================
    Copyright (c) 2012 Hins pan

    Distributed under the answerwo License, Version 1.0.
==============================================================================*/
#include <iostream>
#include <stdlib.h>
#include <stdio.h>
#include <sys/stat.h>
#include <unistd.h>
#include <dirent.h>
#include <string.h>

using namespace std;

#define FORMAT_ERROR -1
const size_t SIZE = 1024;

int main(int argc,char *argv[])
{
    if(argc < 2) {
    	printf("Format: monitor directory\n");
	return FORMAT_ERROR;
    }
    DIR *dir;
    struct dirent* ddir;
    struct stat fbuf;
    char buf[SIZE];
    size_t total = 0, empty = 0;

    dir=opendir(argv[1]);
    while((ddir=readdir(dir))!=NULL) {
        if((strcmp(ddir->d_name,".")==0) || (strcmp(ddir->d_name,"..")==0))
                continue;
	sprintf(buf,"%s%s",argv[1],ddir->d_name);
        stat(buf, &fbuf);
        if(!fbuf.st_size) {
	    empty++;
        }
	total++;
    }
    printf("Total: %d\nEmpty: %d\n",total,empty);
    return 0;
}
