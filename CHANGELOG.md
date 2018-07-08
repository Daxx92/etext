# Changelog

## 0.4.1 (2018-07-08)

#### TL:DR - *Performance Improvements*

Better error messages & file filters

### Features

- Encryption/Decryption of file contents are performed in a background process
- RSA Keys are now generated in a background process

#### Issues Solved

- [#11: Editor freezes when creating RSA Keys](https://bitbucket.org/miscdx/etext/issues/11/editor-freezes-when-creating-rsa-keys)
    - *Commit: [a20aa97c4c46](https://bitbucket.org/miscdx/etext/commits/a20aa97c4c46)*
    
----

## 0.3.0 (2018-07-03)

#### TL:DR - *QoL Enhancements*

Better error messages & file filters

### Features

- Display descriptive messages on errors
- Display only compatible files on open/save dialogs
- Replaced old file extension *.emd* with *.etmd*
    - *File format remains the same, only the extension was updated.*
    - *Both formats can be opened*
    - *New files are to be saved with the new extension* 

#### Issues Solved

- [#4: Display files that can be opened](https://bitbucket.org/miscdx/etext/issues/4/display-files-that-can-be-opened)
    - *Commit: [b4d0ce29f25e](https://bitbucket.org/miscdx/etext/commits/b4d0ce29f25e)*
- [#8: Editor fails if the file isn't correctly formatted](https://bitbucket.org/miscdx/etext/issues/7/why-ask-the-user-for-a-passphrase)
    - *Commit: [1748d7becae2](https://bitbucket.org/miscdx/etext/commits/1748d7becae2)*
    

## 0.2.0 (2018-07-03)

#### TL;DR - *Encryption Support*

Added support for AES/RSA file encryption

#### Features

- Encrypt file content with AES
- Encrypt AES key with RSA

#### Issues Solved
- [#7: Why ask the user for a passphrase?](https://bitbucket.org/miscdx/etext/issues/7/why-ask-the-user-for-a-passphrase)
    - *Commit: [de67f4a71088](https://bitbucket.org/miscdx/etext/commits/de67f4a71088)*

## 0.1.0 (2018-06-27)

#### TL;DR - *(Br)Ace Editor*

Replaced Codemirror with [Ace Editor](https://ace.c9.io/) [(Brace)](https://github.com/thlorenz/brace)

#### Features

- Replaced codemirror with ace
    - *Better performance & integration (webpack)*

## 0.0.0 (2018-06-23)

#### TL;DR - *Project Setup & Basic Functionality*

Setup project dependencies, iterated through different code editors. Basic functionality in place.

#### Features
- Bootstrap 4.1 & vue-bootstrap
- Loading overlay when executing long running actions
- Codemirror-powered markdown editor
    - *Replaced showdown editor (More features)*