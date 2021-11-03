#!/bin/bash
##
# description: Script que permite asignarle privilegios root al apache, así como la gestión básica de ficheros  
# author: ing. Antonio Membrides Espinosa
# date: 02/10/2012
# version: 1.0
##
if [ $# -gt 0 ]
then 
	case $1 in
		chmod)
			if [ $2 -n ] 
				then usr="www-data"
				else usr=$2
			fi

			if [ $3 -n ] 
				then path="/etc/sudoers"
				else path=$3
			fi

			msg1="msg: process to install is loading ..."
			msg2="msg: process to install is finishing ..."

			den="NO"
			host="ALL"
			runas="(root)"
			cmnd="ALL"
			opt="PASSWD"
			echo $msg1
			echo $usr $host=$runas $den$opt:$cmnd >> $path
			echo $msg2
		;;
		copy) echo $2 > $3 ;;
		add) echo $2 >> $3 ;;
		del)
			if [ $4 -n ] 
				then path=$3
				else path=$4
			fi

			tr -d $2 < $3 >> tmp$path
			cat tmp$path > $path
			rm tmp$path
		;;
		replace)
			if [ $5 -n ] 
				then path=$4
				else path=$5
			fi

			tr "$2" "$3" < $4 >> tmp$path
			cat tmp$path > $path
			rm tmp$path
		;;
		*)
			echo "msg: No comand"
		;;
	esac
else 
	echo "Comand list to select: chmod|copy|add|del|replace";
fi

