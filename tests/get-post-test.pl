#!/usr/bin/perl

use strict;
use warnings;

my $input = "";

if ($ENV{'REQUEST_METHOD'} eq "GET") {
  $input = $ENV{'QUERY_STRING'};
}

if ($ENV{'REQUEST_METHOD'} eq "POST") {
  read (STDIN, $input, $ENV{'CONTENT_LENGTH'});
}

print $input;
