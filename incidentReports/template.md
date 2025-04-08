# Incident: 2025-04-08 11-31-04

## Summary

```md
Between the hour of 10:56 am and 11:40 am on Tuesday, April 8, 2025,
one user encountered an error preventing them from ordering pizza.
The event was triggered by a change in the server response of the
pizza factory service at about 11:15 am.

A bug in this code caused a 500 error. The event was detected by Grafana.
The team started working on the event by 10:57 am. This error incident affected 100% of users.

There was no further impact.
```

## Detection

```md
This incident was detected when the "Pizza Creation Failing" error
was triggered and Quenton Barger was notified.

Quenton Barger acknowledged the alert and resolved the issue by 11:40 am.
```

## Impact

```md
For 44 minutes between 10:56 am and 11:40 am on 04/08/2025,
some of our users experienced this incident.

This incident affected 100% of customers, who experienced inability to order pizza.
```

## Timeline

```md
All times are UTC.

- _10:56_ - Error with the pizza ordering endpoint effectively begins.
- _10:56_ - Grafana Monitoring system sends alert for failing pizza orders.
- _10:57_ - Quenton Barger acknowledges the alert and begins fixing issue.
- _11:04_ - Another alert sent for problem persisting.
- _11:16_ - Third alert sent for persisting problem.
- _11:31_ - Source of problem found.
- _11:40_ - Error totally resolved.
```

## Response

```md
After receiving an alert at 10:56 am, I came online at 10:57 am in Provo, Utah.

I was able to find the source of the problem after about 30 minutes of debugging.
I had last pushed a version of the JWT Pizza Service code with a chaos monkey endpoint
on the pizza order endpoint. This caused a lot of confusion at first when trying
to find the source of the error. When I manually went in to test the order endpoint,
I kept running into the chaos monkey which was blocking the actual error.
Eventually I was able to find the error in the response body of the order
request (the chaos monkey did not activate this time). I was able to resolve the issue
quickly after that around 11:38 am.
```

## Root cause

```md
A bug affecting the pizza ordering endpoint was returning a 500 error for every request. 
```

## Resolution

```md
There was a block on the order HTTP requests. In the response there was a link to the site
to report the factory error. I opened the link and it resolved the error.

I then also removed the chaos monkey from the service code and pushed a new version to production.
```

## Prevention

```md
I did not see any other incidents with the same root cause. However,
I did realize there was code in the order endpoint set for this issue.
It included sending the necessary link for resolution when this 500 error occurred.
I think the most important prevention is to read the endpoints carefully, even when you assume you already know what they are doing.
```

## Action items

```md
1. Testing all paths of the api endpoints.
2. Use the development/staging environment properly.
```
