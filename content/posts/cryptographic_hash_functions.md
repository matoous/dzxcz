---
title: "Cryptographic Hash Functions explained"
date: 2020-04-08
slug: cryptographic_hash_functions
draft: false
tags: ["code", "security", "math", "writing"]
---

[_Hash function_](https://en.wikipedia.org/wiki/Hash_function) is a mathematical function that takes arbitrary input
and maps to fixed-size value. Here's a little example of a _hash function_ that maps input to 4 digits number.

```
h("dog") = 1571
h("Hey, that's a beautiful cat you've got over there!") = 9801
h("c") = 0130
```

[_Cryptographic hash function_](https://en.wikipedia.org/wiki/Cryptographic_hash_function) is a hash function
with more restrictive properties that has many applications in cryptography, encryption and security in general.
Here's an example of modern hash function that is used in some way to secure almost all the internet traffic.

```
sha-3("turtle") = 38b33b6f08b5cd5428ddc7aa698d7e8a0a2f15830ef17b9dbb518699f850a141
```

Before we get into hash function characteristics, lets try to design a hash function ourselves.
We will start with something simple, for example a function that takes a number and returns its reminder
after dividing it by 10 (this operation is also called [modulo](https://en.wikipedia.org/wiki/Modulo_operation)).

```
h(x) = x mod 10
```

A few example:

```
h(33) = 3
h(182) = 2
h(10) = 0
...
```

Does this function take an arbitrary input and returns fixed-size output? Yes, it does.
Is it a good cryptographic hash function? Well, no it isn't. To make a hash functions useful in cryptography
we introduce further restrictions.

## Properties

First one is **Pre-Image Resistance**. What this property means is, that it should be hard
to reverse the hash function. In other words, knowing the value that came out of the hash function
should provide zero to none information about what came in. Here our previously defined function
fails. Knowing the value that came out means knowing the last digit of the number that came in.

Let's try to fix that and change our hash function. Now we will add random number to the
input before doing what we did before, taking the reminder of division by 10. This
function still returns fixed-size value, furthermore, it is no longer possible to tell
anything about the input. Do we have a good hash function? Not yet.

Another property that good hash functions should have is being **Deterministic**.
Deterministic function always maps the same input to the same output. Our function
doesn't do that. Number _100_ can be mapped to 1, 4, or any other number depending on
the random value we add.

There are two more properties that we need that are hard to show on easy functions.
First one being **Efficiency**. Hash functions must be fast to compute to be usable.
It should be easy to compute the output for any value but really hard to find input for given output.
This is partially overlapping with _Pre-Image Resistance_, and we call such function a _One-way Function_.

The last property of hash functions is **Collision Resistant**. That means that it must be
extremely unlikely (read _"virtually impossible"_) for two inputs to produce the same output.
That's hard to imagine on the example that we set with a function that has 10 possible outputs
but take for example [_SHA-3_](https://en.wikipedia.org/wiki/SHA-3), modern secure hash function
that is the current standard. This function has

```
2^256 = 115792089237316195423570985008687907853269984665640564039457584007913129639936
```

possible output values. Such a huge output space makes it practically impossible to find two
inputs that map to the same output.

We have covered the 4 base properties of good and secure hash function. _Pre-Image Resistance_, being _Deterministic_,
_Efficiency_ and _Collision Resistance_. Now lets show why these properties are important on some real life
examples.

## Applications

Cryptographic hash functions are a basic tool of modern cryptography and have many applications in
fields such as digital signatures, fingerprinting, message authentication and other forms of authentication,
and more.

### Data integrity

First application that we will look into is data integrity verification. How that works is that we take a
message, file, or any other digital medium, we create _message digest_ (compute the hash function value
for given message or file) and any time we need to verify the integrity we compute the message digest again
and compare it with the original. This way we can determine whether any changes of modifications have been made
to the original message or file during transmission.

Message digests are for example published by many websites to allow verification of integrity of downloaded files.
The whole process looks like this: an author creates application or file that he wants to publish securely for public.
He creates _message digest_ for given file and publishes it alongside the file on his website. User downloads the file,
computes message digest using the same cryptographic hash function as the author did and compares the digest with
the one published by the author. This way he can verify that the files hasn't been tempered with during the download.
This method isn't bulletproof because the hash on the website could be tempered but as long as we trust the website
we can trust the downloaded file as well.

### Digital Signatures

Other application of cryptographic hash functions are Digital signatures. Digital signatures are closely
related to Data integrity, they again allow you to verify data integrity. Furthermore, digital signatures
tie the signer to the document making it hard for the signer to deny signing the document. This property
is called [non-repudiation](https://en.wikipedia.org/wiki/Non-repudiation) and refers to a situation
where author cannot dispute validity or authorship of associated document.

To create a Digital signature the author creates _message digest_ and signs it using his _private key_.
Digital signature is then distributed alongside the document or file. If anyone wants to verify
the signature he needs to compute the message digest on his side, decrypt the signature using authors _public key_,
and compare the two message digests. This way he can verify not only the integrity of the data but also
the authorship. Private key in this case works sort of like a credit card pin, it is something
that only the owner knows so signing the message with his private key ties him indisputably to the
signed document.

Digital signatures are used for example by The United States Government Printing Office (GPO) to sign
electronic versions of the budget, public and private laws, and congressional bills.

### Passwords

Cryptographic hash functions are also the safest way of storing passwords. All major websites and applications
(facebook, google, etc.) use hashing for password storage and user authentication, and if they don't, they should.

To show how that works lets start with a _bad_ example of how passwords _shouldn't_ be handled.
A bad but straightforward approach to password authentication is prompting the user for a password
and then storing the password as the user entered it alongside his username or email on the server.
To authenticate the user all that is need is to compare the entered password with the stored one,
if they match, the user successfully authenticates.
Where this approach lacks though is when things go south and malicious party steals the credentials
from the server - suddenly they have information about all users tied with their passwords.

Good approach is hashing the password before storing it on the server. This way at any point in time the
only person that knows the password is you. To authenticate you the server computes the hash again
and compares it with the stored one. Now even if someone steals the credentials he has no way of retrieving
your password from the hash (thanks to the _Pre-Image Resistance_ property).
