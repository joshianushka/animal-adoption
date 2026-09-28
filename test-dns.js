const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

dns.resolveSrv(
  "_mongodb._tcp.cluster0.cdf7kds.mongodb.net",
  (err, records) => {
    if (err) {
      console.log("DNS Error:", err);
    } else {
      console.log("DNS Success:");
      console.log(records);
    }
  }
);