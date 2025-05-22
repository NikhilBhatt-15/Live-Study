#!/bin/bash

STREAM_NAME="$1"
HLS_DIR="/var/www/hls/$STREAM_NAME"
mkdir -p "$HLS_DIR"
chmod -R 755 "$HLS_DIR"

/usr/bin/ffmpeg -loglevel warning \
    -i "rtmp://127.0.0.1/live/$STREAM_NAME" \
    -c:v libx264 -preset veryfast -tune zerolatency -c:a aac \
    -f hls \
    -hls_time 4 \
    -hls_list_size 0 \
    -hls_segment_filename "$HLS_DIR/%03d.ts" \
    "$HLS_DIR/index.m3u8" \
    > "/var/www/hls/ffmpeg_hls_${STREAM_NAME}.log" 2>&1