//Generating Private RSA Key
openssl genrsa -out rsa_1024_priv.pem 1024

//Generating Public RSA Key
openssl rsa -pubout -in rsa_1024_priv.pem -out rsa_1024_pub.pem