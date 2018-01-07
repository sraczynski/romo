module.exports = {
  networks: {
    rinkeby: {
      network_id: 4,
      host: "localhost",
      port: 8545,
      from: "0xAf9b654F454A4726acbDfe201Fc4F93D05e126ec",
      gas: 15000000
    },
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*", // match any network
      from: "0x0000000000000000000000000000000000000001"
    }
  },
  rpc: {
    host: "localhost",
    gas: 5000000,
    port: 8545
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
};
