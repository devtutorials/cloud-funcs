import requests, time, sys

POLL_EP = "http://35.225.71.61/actuator/metrics/req.total"

def poll(pollRate=1):
    def get_total():
        return requests.get(POLL_EP).json()["measurements"][0]["value"]
    elapsed = 0.1
    while True:
        start_time = time.time()
        old_reqs = get_total()
        elapsed = time.time() - start_time
        time.sleep(pollRate - elapsed)
        new_reqs = get_total()
        print("{0} req/s".format((new_reqs - old_reqs) / pollRate))

if __name__ == "__main__":
    args = sys.argv[1:]
    try:
        if len(args) == 1:
            poll(int(args[0]))
        else:
            poll()
    except KeyboardInterrupt:
        print("\nexiting gracefully")
