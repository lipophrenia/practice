#!/bin/bash

program_name=$0
key=$1

function usage 
{
	echo "Usage: $program_name [parameter]"
	echo "parameter is OES type. Must be OES1 .. OES8"
	echo "OES1 (sony ev7520):            $program_name OES1"
	echo "OES2 (sony ev2700 + Noxant):   $program_name OES2"
	echo "OES3 (sony ev2700 + la6110):   $program_name OES3"
	echo "OES4 (sony ev7520 + tfm 1024): $program_name OES4"
	echo "OES5 (tfm mx640):              $program_name OES5"
	echo "OES6 (savgood sg2090):         $program_name OES6"
	echo "OES7 (sony ev7520 + nit275):   $program_name OES7"
	echo "OES8 (sony ev7520 + Xcore Micro III): $program_name OES8"
	exit 1
}

if [ $# == 0 ]; then
	usage
fi

cd ~/
mkdir -p boot
mount /dev/mmcblk0p1 ./boot
cd boot
rm devicetree.dtb

if [ $1 == "OES1" ]; then
echo "Config OES1..."
ln -s am57xx-stt-ev7520.dtb devicetree.dtb
fi

if [ $1 == "OES2" ]; then
echo "Config OES2..."
ln -s am57xx-stt-ex1020-ch7102.dtb devicetree.dtb
fi

if [ $1 == "OES3" ]; then
echo "Config OES3..."
ln -s am57xx-stt-ex1020-la6110.dtb devicetree.dtb
fi

if [ $1 == "OES4" ]; then
echo "Config OES4..."
ln -s am57xx-stt-ev7520-cameralink.dtb devicetree.dtb
fi

if [ $1 == "OES5" ]; then
echo "Config OES5..."
ln -s am57xx-stt-mx640.dtb devicetree.dtb
fi

if [ $1 == "OES6" ]; then
echo "Config OES6..."
ln -s am57xx-stt-sg2090.dtb devicetree.dtb
fi

if [ $1 == "OES7" ]; then
echo "Config OES7..."
ln -s am57xx-stt-ev7520-nit275.dtb devicetree.dtb
fi

if [ $1 == "OES8" ]; then
echo "Config OES8..."
ln -s am57xx-stt-ev7520-xcoremicro3.dtb devicetree.dtb
fi

cd ..
umount boot
rm -r boot