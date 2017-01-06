#!/usr/bin/perl

use strict;
use warnings;
use AnyEvent;

# Disable the built-in buffering of the Perl interpreter:
$| = 1;

my $input;
my $event_loop = AnyEvent->condvar;

# Wait for STDIN input:
my $wait_for_input = AnyEvent->io (
  fh => \*STDIN,
  poll => "r",
  cb => sub {
    $input = <STDIN>;
    chomp $input;

    if ($input =~ "_close_") {
      print "_closed_";
      exit();
    }
  }
);

# Print every second:
my $wait_one_second = AnyEvent->timer (
  after => 0,
  interval => 1,
  cb => sub {
    print "Seconds from the Unix epoch: ".time."<br>Last input: ".$input;
  },
);

$event_loop->recv;
