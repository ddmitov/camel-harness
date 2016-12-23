#!/usr/bin/perl

use strict;
use warnings;

# Built-in Perl buffering should be disabled on Windows to prevent
# seeing all STDOUT output after the script has ended.
$|=1;

my $maximal_time = 10; # seconds

print "Long running Perl script started.";

for (my $counter=1; $counter <= $maximal_time; $counter++){
  sleep (1);
  if ($counter == 1) {
    print "1 second elapsed.";
  }

  if ($counter > 1 and $counter <= $maximal_time) {
    print "$counter seconds elapsed.";
  }
}

sleep (1);
print "Long running Perl script ended.";
