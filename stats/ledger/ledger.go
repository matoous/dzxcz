package ledger

import (
	"os"

	"github.com/howeyc/ledger"
)

func X() {
	f, err := os.Open("/Users/matousdzivjak/ledger.ldg")
	if err != nil {
		panic(err)
	}
	defer f.Close()
	ldg, err := ledger.ParseLedger(f)
	if err != nil {
		panic(err)
	}

	for _, tx := range ldg {
		for _, post := range tx.AccountChanges {
			println(post.Name, post.Balance)
		}
	}
}
