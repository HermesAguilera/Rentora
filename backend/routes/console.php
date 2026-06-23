<?php

use Illuminate\Support\Facades\Schedule;
use App\Jobs\ActivateConfirmedBookings;
use App\Jobs\CompleteActiveBookings;
use App\Jobs\SyncSpaceViewCounts;
use App\Jobs\ExpireReviewInvitations;

Schedule::job(new ActivateConfirmedBookings)->dailyAt('00:05');
Schedule::job(new CompleteActiveBookings)->dailyAt('00:10');
Schedule::job(new SyncSpaceViewCounts)->everyFiveMinutes();
Schedule::job(new ExpireReviewInvitations)->daily();
