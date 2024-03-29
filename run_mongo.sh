#!/bin/bash
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

data_dir_path="$parent_path/db_data/db/"
log_path="$parent_path/db_data/log.txt"
echo "data_dir_path : $data_dir_path"
echo "log_path : $log_path"

#Make data dirs if needed. 
mkdir -p $data_dir_path

nohup mongod --dbpath $data_dir_path >> $log_path &
