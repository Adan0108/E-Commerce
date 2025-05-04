------Command for privatekey-----------
openssl genrsa -out private_key.pem 2084

------Command for publickey------------
openssl rsa -pubout -in private_key.pem -out public_key.pem