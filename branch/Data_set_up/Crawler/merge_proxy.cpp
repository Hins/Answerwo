/*=============================================================================
    Copyright (c) 2012 Hins pan

    Distributed under the answerwo License, Version 1.0.
==============================================================================*/
#include <iostream>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <vector>
#include <algorithm>

using namespace std;

#define FORMAT_ERROR 1

const char * sfile;
const char * afile;
FILE *fp, *fp2;

int main(int argc,char *argv[])
{
    if(argc < 3) {
    	printf("Format: merge_proxy sourcefile appendfile\n");
	return FORMAT_ERROR;
    }
    sfile = argv[1];
    afile = argv[2];
    const size_t SIZE = 1024;
    char buf[SIZE];
    vector<string> v;
    vector<string>::iterator itr;
    string ip;

    fp = fopen(sfile,"at+");
    while(fgets(buf,SIZE,fp) != NULL) {
    	ip = buf;
	ip = ip.substr(0,ip.length()-1);
	v.push_back(ip);
    }

    fp2 = fopen(afile,"r");
    while(fgets(buf,SIZE,fp2) != NULL) {
    	ip = buf;
        ip = ip.substr(0,ip.length()-1);
	itr = find(v.begin(),v.end(),ip);
	if(itr == v.end()) {
	    fprintf(fp,"%s\n",ip.c_str());
	}
    }

    fflush(fp);
    fclose(fp);
    fclose(fp2);
    return 0;
}
