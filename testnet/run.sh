#!/bin/bash

ROMOROOT=`readlink -f . | sed -n 's/\(.*\)\(\/romo\).*/\1\2/p'`
TESTNETDIR="$ROMOROOT/testnet"

geth --datadir $TESTNETDIR/datadir --rinkeby --rpc --unlock 0xAf9b654F454A4726acbDfe201Fc4F93D05e126ec --rpccorsdomain "*" $*
