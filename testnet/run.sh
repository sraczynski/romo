#!/bin/bash

ROMOROOT=`readlink -f . | sed -n 's/\(.*\)\(\/romo\).*/\1\2/p'`
TESTNETDIR="$ROMOROOT/testnet"

# Network IDs:
# 3  - Ropsten (PoW, old UPort network)
# 4  - Rinkeby (clique consensus, new UPort network)
geth --datadir $TESTNETDIR/datadir --networkid 4 --rpc
