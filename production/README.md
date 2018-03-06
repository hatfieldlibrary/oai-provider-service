# Production Environment

This service uses dotenv to configure the environment.  Normally, the .env 
file contains information that you would not wish to export to version control.

Our .env files do not contain sensitive information. However, this may not 
always be the case, here or in other setting.  Be aware of this, and if 
you add revealing information to .env files be sure to remove the files from 
version control before committing.

This directory contains the version of .env that is used in production. It
is copied to the build directory `('dist')` by the gulp `copy-production` task. 