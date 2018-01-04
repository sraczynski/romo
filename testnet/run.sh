#!/bin/bash

ROMOROOT=`readlink -f . | sed -n 's/\(.*\)\(\/romo\).*/\1\2/p'`
TESTNETDIR="$ROMOROOT/testnet"

# Network IDs:
# 3  - Ropsten (PoW)
# 4  - Rinkeby (clique consensus)
geth --datadir $TESTNETDIR/datadir --networkid 3 --rpc
