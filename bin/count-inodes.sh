#!/bin/bash
# count-inodes - count files in all subdirectories under current directory.
echo 'echo $(ls -a "$1" | wc -l) $1' > /tmp/count-inodes_$$
chmod 700 /tmp/count-inodes_$$
find . -mount -type d -print0 | xargs -0 -n1 /tmp/count-inodes_$$ | sort -n
rm -f /tmp/count-inodes_$$
