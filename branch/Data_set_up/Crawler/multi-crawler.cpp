/*=============================================================================
    Copyright (c) 2012 Hins pan

    Distributed under the answerwo License, Version 1.0.
==============================================================================*/
#include <iostream>
#include <stdlib.h>
#include <stdio.h>

using namespace std;
const size_t SIZE = 1024;

int main(int argc,char *argv[])
{
    char buf[SIZE];
    for(int i = 1; i <= 44; i++) {
	sprintf(buf,"./crawler -d parameters/gzyy/urls/%d parameters/gzyy/proxy_ips/%d &> parameters/gzyy/%d &",i,i,i);
	system(buf);
    }
    return 0;
}
