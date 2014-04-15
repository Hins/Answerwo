#!/bin/bash

#http://www.56ads.com/article/201112/11519.html
#http://www.56ads.com/article/201112/10318.html
#http://www.56ads.com/article/201201/18212.html
#http://www.56ads.com/article/201201/18212_2.html
#http://www.56ads.com/article/201201/17208.html
#http://www.56ads.com/article/201111/530.html
#http://www.56ads.com/article/201111/530_2.html
#http://www.56ads.com/article/201112/3109.html
#http://www.56ads.com/article/201112/1002.html
#http://www.56ads.com/article/201112/2105.html
#http://www.56ads.com/article/201201/18514.html
#http://www.56ads.com/article/201201/18514_2.html
#http://www.56ads.com/article/201201/18413.html
#http://www.56ads.com/article/201201/18112.html
#http://www.56ads.com/article/201201/18615.html
#http://www.56ads.com/article/201201/18615_2.html
#http://www.56ads.com/article/201201/17611.html
#http://www.56ads.com/article/201201/17510.html
#http://www.56ads.com/article/201201/18816.html
#http://www.56ads.com/article/201201/19217.html
#http://www.56ads.com/article/201201/16705.html
#http://www.56ads.com/article/201201/16504.html
./ProxyIps_Parse "http://www.56ads.com/article/201201/16504.html" "<div class=\"content\">" "</div>" "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\:[0-9]{1,5}"
