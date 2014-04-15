#include <iostream>
#include <stdlib.h>
#include <stdio.h>
#include <sys/stat.h>
#include <unistd.h>
#include <dirent.h>
#include <string.h>

using namespace std;

#define FORMAT_ERROR -1

int main(int argc,char *argv[])
{
    if(argc < 3) {
	printf("Format: cleanup directory size\n");
	printf("Format: cleanup -e directory size\n");
	return FORMAT_ERROR;
    }
    DIR *dir;
    struct dirent* ddir;
    struct stat fbuf;
    char buf[1024];

    if(!strcmp(argv[1],"-e")) {
	dir=opendir(argv[2]);
        while ((ddir=readdir(dir))!=NULL) {
            if((strcmp(ddir->d_name,".")==0) || (strcmp(ddir->d_name,"..")==0))
                continue;
            sprintf(buf,"%s/%s",argv[2],ddir->d_name);
            stat(buf, &fbuf);
            if(fbuf.st_size == atoi(argv[3])) {
                sprintf(buf,"rm -rf %s/%s",argv[2],ddir->d_name);
                //printf("%s\n",buf);
                system(buf);
            }
        }
    }
    else {
        dir=opendir(argv[1]);
        while ((ddir=readdir(dir))!=NULL) {
            if((strcmp(ddir->d_name,".")==0) || (strcmp(ddir->d_name,"..")==0))
                continue;
	    sprintf(buf,"%s/%s",argv[1],ddir->d_name);
	    stat(buf, &fbuf);
	    if(fbuf.st_size <= atoi(argv[2])) {
	        sprintf(buf,"rm -rf %s/%s",argv[1],ddir->d_name);
	        //printf("%s\n",buf);
	        system(buf);
	    }
        }
    }

    return 0;
}
