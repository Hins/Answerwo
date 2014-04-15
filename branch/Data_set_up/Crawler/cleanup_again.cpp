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

using namespace std;

#define FORMAT_ERROR -1

int main(int argc,char *argv[])
{
    if(argc < 2) {
        printf("Format: cleanup directory\n");
        return FORMAT_ERROR;
    }
    DIR *dir;
    struct dirent* ddir;
    struct stat fbuf;
    char buf[1024];

    dir=opendir(argv[1]);
    while ((ddir=readdir(dir))!=NULL) {
        if((strcmp(ddir->d_name,".")==0) || (strcmp(ddir->d_name,"..")==0))
                continue;
        sprintf(buf,"%s/%s",argv[1],ddir->d_name);
        stat(buf, &fbuf);
        if(fbuf.st_size == 218) {
	    sprintf(buf,"rm -rf %s/%s",argv[1],ddir->d_name);
	    //printf("%s\n",buf);
            system(buf);
        }
    }

    return 0;
}
