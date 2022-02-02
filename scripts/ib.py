from ib_insync import *

ib = IB()
ib.connect(port=4001)

for p in ib.positions():
    print(p)
    print(ib.reqFundamentalData(p.contract, 'ReportsFinSummary'))
