/*=============================================================================
    Copyright (c) 2012 Hins pan

    Distributed under the answerwo License, Version 1.0.
==============================================================================*/
#include <iostream>
#include <stdlib.h>
#include <stdio.h>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

int main(int argc,char *argv[])
{
    if(argc < 3) {
    	printf("Format: CntElimination src_file dest_file\n");
	return -1;
    }
    FILE *fp = fopen(argv[1],"r");
    const size_t SIZE = 1024;
    char buf[SIZE];
    string str;
    vector<string> v;
    vector<string>::iterator itr;
    while(fgets(buf,SIZE,fp) != NULL) {
    	str = buf;
	itr = find(v.begin(),v.end(),str);
	if(itr == v.end()) {
	    v.push_back(str);
	}
    }
    fclose(fp);
    fp = fopen(argv[2],"w");
    for(itr = v.begin();itr != v.end(); itr++) {
    	fprintf(fp,"%s",(*itr).c_str());
    }
    fflush(fp);
    fclose(fp);
    return 0;
}
