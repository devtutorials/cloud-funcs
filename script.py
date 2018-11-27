import sys, time, requests, math
import background

# Note: we're depending on language overhead to prevent us from exceeding rate limit

POLL_EP = "http://35.225.71.61/actuator/metrics/req.total"
CLOUD_EP = "http://localhost:8010/daring-runway-221704/us-central1/actuator2?rateLimit={0}/s&interval={1}&numReqs={2}"

MIN_INTERVAL = 100 # in milliseconds; in reality ~20 or less but to be safe
MAX_RATE = 1000 / MIN_INTERVAL


def start_requests(rate_limit, total_reqs):
    num_cloudfuncs = math.ceil(rate_limit / MAX_RATE)
    num_reqs = total_reqs // num_cloudfuncs # not exact because of floor divide
    avg_rate = rate_limit / num_cloudfuncs # req/s
    interval = 1000 / avg_rate # ms/req
    req_ep = CLOUD_EP.format(rate_limit, interval, num_reqs)
    print("Executing {0} Cloud Functions each running {1} requests with interval {2}ms".format(num_cloudfuncs, num_reqs, interval))

    @background.task
    def single_request():
        print(requests.get(req_ep))

    for _ in range(num_cloudfuncs):
        single_request()

    # async_list = []
    # def callback(response):
    #     print("Done with request: ", end="")
    #     print(response)
    #
    # for _ in range(num_cloudfuncs):
    #     action_item = grequests.get(req_ep, hooks={"response": callback})
    #     async_list.append(action_item)
    #
    # print("mapping async requests")
    # grequests.map(async_list)
    # print("done mapping")

def poll(pollRate=1):
    def get_total():
        return requests.get(POLL_EP).json()["measurements"][0]["value"]
    while True:
        old_reqs = get_total()
        time.sleep(pollRate)
        new_reqs = get_total()
        print("{0} req/s".format((new_reqs - old_reqs) / pollRate))

def test_poll(pollRate=1):
    def get_total():
        return requests.get(POLL_EP).json()["measurements"][0]["value"]
    while True:
        print(get_total())
        time.sleep(pollRate)

if __name__ == "__main__":
    args = sys.argv[1:]
    assert len(args) == 2
    rate_limit = int(args[0]) # for now implicitly this number per second
    total_reqs = int(args[1])

    start_requests(rate_limit, total_reqs)
    # try:
    #     poll()
    # except KeyboardInterrupt:
    #     print("\nexiting gracefully")
