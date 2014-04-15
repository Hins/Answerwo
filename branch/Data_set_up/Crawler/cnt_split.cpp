/*=============================================================================
    Copyright (c) 2012 Hins pan

    Distributed under the answerwo License, Version 1.0.
==============================================================================*/
#include <iostream>
#include <stdlib.h>
#include <stdio.h>

using namespace std;

#define FORMAT_ERROR -1
#define NO_ERROR 0
const size_t SIZE = 1024;

int main(int argc, char *argv[])
{
    if(argc < 4) {
	printf("Format: cnt_split file output_directory size\n");
	return FORMAT_ERROR;
    }
    FILE *fp = fopen(argv[1],"r");
    FILE *fp2;
    int size = atoi(argv[3]);
    int i = 0;
    char buf[SIZE],file_path[SIZE];
    //fseek(fp,0,SEEK_SET);
    while(fgets(buf,SIZE,fp) != NULL) {
    	if(!(i%size))
	{
	    if(i) {
	    	fflush(fp2);
	    	fclose(fp2);
	    }
	    sprintf(file_path,"%s/%d",argv[2],i/size+1);
	    fp2 = fopen(file_path,"w");
	}
	fprintf(fp2,"%s",buf);
	i++;
    }
    fclose(fp);
    fflush(fp2);
    fclose(fp2);
    return NO_ERROR;
}
