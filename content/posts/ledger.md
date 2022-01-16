---
title: "Keeping your finances at check with Ledger"
date: 2020-02-19
slug: ledger
draft: false
tags: ["finance", "terminal", "writing"]
---

For the last <del>three months</del> <ins>year</ins>, I have been keeping track of all my expenses and income using Ledger,
and it slowly turned into a little obsession of mine. Here's my take on what ledger is,
how to keep one, and why you need one.

## What is Ledger

Ledger is a double entry accounting system that is accessed from a command line and kept in simple text files.
This is a lot of words for introduction, but all the terms will be explained in the following paragraphs.
For now, all you need to know is that this is one of many ways of bookkeeping - recording of financial transactions.
And that thanks to ledger, you will be able to know how much you are spending, on what, and where your money lies.

## Double Entry accounting

In accounting, everything is based on accounts.
An account is every type of expense, income, or a place that holds any monetary value.
In double entry accounting each transaction is recorded as a flow between at least two accounts
and it is required for the total amount removed from accounts to equal to the total amount added.
This is a partial check that every transaction was correctly recorded, and no money was lost in the process.
In practice, it means that adding 1000$ in one place (account) requires you to remove 1000$ from another place.
The consequence of this is that the balance of all accounts is always zero.

For example, buying groceries for 42$ will be recorded as moving 42$ from _Credit Card_ to _Groceries_ account.
In the same way, receiving 2000$ salary means a flow of 2000$ from account _Salary_ to account _Bank_. While the names
of the accounts are entirely up to you there are certain naming conventions. In general, you would have the following main
accounts:

- Expenses - where the money goes
- Income - where the money comes from
- Assets - where money sits
- Liabilities - money you owe
- Equity - the real value of your property

You can add further levels to the accounts as detailed as you need, for example, _Expenses_ -> _Fun_ -> _Tickets_ -> _Concerts_.

## Ledger

Ledger is a command line tool for double-entry accounting. It is an extremely versatile tool
that takes some time to master but once learned it can be used seamlessly for both personal and professional accounting.

Documentation for ledger can be found at [https://www.ledger-cli.org/](https://www.ledger-cli.org/) in [pdf](https://www.ledger-cli.org/3.0/doc/ledger3.pdf)
or [html](https://www.ledger-cli.org/3.0/doc/ledger3.html) format. There's also awesome [Getting Started With Ledger](https://rolfschr.github.io/gswl-book/latest.html)
tutorial by Rolf Schröder & Contributors where I took a lot of inspiration from, and that might help you get started.
Finally, if you want just a brief introduction and want to learn the rest as you go, you can quickly scrim through
[Ledger CLI cheatsheet](https://devhints.io/ledger).

## Working with Ledger

Working with Ledger consists of two distinct actions: updating the list of transactions in your journal file
and using the ledger tool to view and interpret the recorded transactions.
Ledger provides you with a set of tools to analyze and filter out the transactions recorded in your ledger files.

Following the groceries example from an introduction to the double entry accounting the transaction recorded
in your journal file would look like this:

```text
2020/04/14 Groceries
  Expenses:Groceries  $42
  Assets:Checking  $-42
```

Each transaction starts with a date and title of the transaction.
The heading is followed by two or more lines of accounts involved in the transaction with the amount of money
moved from or into the account. Lines with accounts (_postings_) start with whitespace,
and the amount is separated by at least two whitespaces from the account.
Two spaces are required because the account name itself can contain a space, for example,
`Expenses:Car Insurance` or `Expenses:Food and Drinks`.
The amount must sum up to zero (otherwise, it wouldn't be a valid double entry accounting transaction).
Ledger can calculate the appropriate amount for the last account for you so it would be valid and more comfortable
to write:

```text
2020/04/14 Groceries
  Expenses:Groceries  $42
  Assets:Checking
```

The journal file consists of transactions such as the previous one and some optional metadata.
Following are some more illustrative examples to help get you started:

```text
; Set up your initial state using opening balances
; This will be your first transaction
; (assuming you are not starting with zero money).
; '*' means that the transaction is cleared
; e.g., the money was moved from one account to the other.
2020/04/14 * Opening Balance
  Assets:Checking  $1490
  Assets:Savings  $3220
  Liabilities:Loan  $200
  Equity:Opening Balances

; Salary comes from your employer to your checking account.
2020/04/15 * Salary
  Assets:Checking  $1330
  Income:Salary

; Withdrawal means moving money from your checking account to cash.
2020/04/16 * ATM withdrawal
  Assets:Cash  $40
  Assets:Checking

; Payig for beer by cash.
2020/04/16 * The Pub
  Expenses:Fun:Beers  $12
  Assets:Cash

; Paying for your friend's beer because he doesn't have money.
2020/04/17 * The Pub
  Assets:Reimbursements  $8 ; Payee: Friends Name
  Assets:Cash

...
```

We will explain all the concepts more in-depth later on. Now let's get started with ledger to make some sense of our transactions.

## Installing Ledger

To get started with Ledger, first install it on your device. You can find everything
on Ledgers [download page](https://www.ledger-cli.org/download.html).

### MacOS

To install ledger or MacOS simply run

```shell script
brew install ledger
```

### Linux & BSD

Go to [Ledger Cli Download Page](https://www.ledger-cli.org/download.html)
and download the latest version of binary for your distribution.

### Windows

It's a little bit harder to get Ledger running on windows, but the simplest way to do so
is to go to [Ledger Binaries Download Page](https://github.com/AlexanderAA/ledger_binaries_windows)
and download the binary for the Windows system.

## Reports

Journal is an excellent way to keep track of transactions but doesn't give as much information about our current
financial situation and insight into our spending and income.
This is where the Ledger tool comes in. Ledger tool provides you with a set of commands and tools
to make sense of your journal. The most used commands for reporting are `balance` (`bal`) and `register` (`reg`).

### Balance

The balance report creates total balance for all transactions. The most basic usage looks like this:

```shell script
$ ledger -f ledger.txt bal[ance]

        $1720.00  Assets:Checking
       $-1200.00  Equity:OpeningBalances
         $220.00  Expenses
         $133.00    Food:Groceries
         $127.00    Unknown
       $-1000.00  Income:Salary
 ---------------
               0
```

Ledger, of course, allows you to do plenty of things with the balance. Including but not limited to:

```shell script
# Restrict by date. Use -p or --period.
$ ledger -p "last 3 months" bal
$ ledger -p "this month" bal
$ ledger -p "2020" bal

# Balance by account name
$ ledger bal Expenses
$ ledger bal Assets and Liabilities

# Show subaccounts only until certain depth
$ ledger --depth 2 bal
```

### Register

Register command displays ledger entries like a register. Basic usage is simple:

```shell script
$ ledger -f ledger.txt reg[istry]

...
2020/04/15 Some Restaurant         Expenses:Food:Lunches             $7.00         $47.20
                                   Assets:Checking                  $-7.00         $40.20
2020/04/15 Some Coffee Shop        Expenses:Food:Coffee              $6.00         $46.90
                                   Assets:Checking                  $-6.00         $40.20
2020/04/15 Groceries Shop          Expenses:Food:Groceries          $10.00         $50.00
                                   Assets:Checking                 $-10.00         $40.20
2020/04/15 My Company              Assets:Checking               $1,500.00      $1,500.00
                                   Income:Salary:Company        $-1,500.00         $40.00
2020/04/15 Rent                    Expenses:Living:Rent            $200.00        $200.00
                                   Assets:Checking:Airbank        $-200.00         $40.20
```

Again, ledger allows you to do much more, often in the same way as with `balance` command:

```shell script
# Restrict by period.
$ ledger -p "feb 2020" reg

# Group by week
$ ledger reg -W

# Show weekly expenses
$ ledger reg -W -n Expenses

# Show weekly expenses as total amount
$ ledger reg -W -n Expenses
```

There's much more you can do. To see the full list of flags and commands, you can use, visit the [official documentation](https://www.ledger-cli.org/3.0/doc/ledger.1.html).

## Keeping a Journal

The essential part of Ledger and accounting, in general, is keeping a good journal.
Ledger has been designed to make that as easy as possible with its simple format
and by automatically determining us much information as possible.
For example, if Ledger encounters posting with an unknown account, it will create it.
Or if you use commodity, that the Ledger hasn't seen before, it will create that commodity
and automatically determine how to display it (placement of currency, display precision, thousands separator, etc.)
based on how you used the commodity in the journal.

While the format as simple as possible, there are still two rules that need to be followed.
First is that the start of the transaction is at the first line followed by accounts
indented by at least one space. Secondly, there must be at least two spaces between the
account and the amount. If you don't follow these rules Ledger will report an error
and exit.

Sometimes the flexibility isn't desired and might lead to difficulties. In order
to combat inconsistency, you can define accounts and payees beforehand and ledger will
print error and exit if it encounters an unknown account or payee.

```text
; Define your accounts
account Assets
account Assets:Cash
account Expenses
account Expenses:Utilities
```

Use `--strict` flag to enable the strict mode. Strict mode will print warnings
but still calculate the results, if you want to force the consistency you can use
`--pedantic` that will cause the Ledger to exit with error on undefined accounts and commodities.

```shell script
$ ledger bal --strict
Warning: "journal.dat", line 6: Unknown account ’Asets:Checking’
```

If you already started a journal and would like to enable the strict mode, you
can find out all the accounts that you use by running `$ ledger accounts`. To put
them into your journal, you need to prepend them with `account`; this can be simplified
by running `$ ledger accounts | awk '{print "account " $0}'`.

## Advanced usage

You have seen some basic usage in previous sections, here are some more advanced concepts
you will encounter with Ledger accounting.

### Resetting a Balance

Sometimes your ledger account balance and real account balance values diverge.
This might happen, for example, if you lose track of your cash spending. To bring
the ledger back to order you can simply reset the balance to its current value
using the `=` operator and `Adjustents` account.

```text
2020/04/20 Adjusting Cash
   Assets:Checking  = $20
   Equity:Adjustments
```

### Commodities

Ledger allows you to keep track of investments and multiple currencies.
Investment is anything that is not in dollars (or whatever your default currency is).
In the sense of Ledger, there's no difference between stocks and currencies; both are handled
the same way. It is only recommended to put currency symbols before the value
and commodity symbols after it. To allow ledger to handle multiple commodities (we will use currencies
and commodities interchangeably) it must know how to convert them.
This is done by defining the commodity's value in terms of another commodity.
Most often, you would specify the purchase price of the commodity at the time of transaction.

```text
2020/04/21 Stock purchase
  Assets:Broker  10 TSLA @ $420.00
  Assets:Broker
```

Now at the time of sale:

```text
2020/04/22 Stock sale
  Assets:Broker                    -10 TSLA {$420.00} @ $500.00
  Income:Capital Gains             $-800.00
  Assets:Broker                   $5,000.00 ; you can ommit this value
```

The `{$420.00}` behind `TSLA` stock is a _lot price_.
_Lot price_ means that the price of the given commodity can differ for each _lot_.
This allows you to track multiple investments in the same currency bought and different
initial prices.

Sometimes the commodities are consumed and are not meant to be sold later.
In that case, you want to fix the lot price, so it stays at the same as at the purchase time.

```text
2020/04/23 Shell
  Expenses:Gasoline  40 L {=$1.5}
  Assets:Checking
```

On the background, this introduces a new commodity with fixed value `L {=$1.5}`.

Sometimes you also want to see the values in terms of a particular commodity.
For example, you might have a lot of investments going on and would like to
know your current total equity in terms of dollars. This can be done using
the `-X (--exchange) COMMODITY` flag. The Ledger will convert all the commodity values
based on the latest available price it can find.

### Budgeting

Budgeting is another feature of Ledger. Budgeting allows you to control your
income and expenses, by reporting on how far or close your actual financial
activity matches your expectations.

To get started with budgeting, you define periodic transactions at the top
of your ledger file. These transactions are almost identical to any other transactions
you would record except that they start by tilde (`~`) and have period expression
instead of the payee in the title.

```text
~ Monthly
  Expenses:Rent  $500.00
  Expenses:Food  $450.00
  Expenses:Insurance  $150.00
  Expenses:Party  $50.00
  ; other expenses
  Expenses  $200.00
  Assets:Checking

~ Yearly
  Expenses:Car:Repair  $500.00
  Assets
```

If you don't know what your monthly expenses are for individual categories
following command that will report your monthly average might help you:

```shell script
ledger bal --monthly --average expenses
```

Keep in mind though that in order to get accurate estimates you need to
be keeping ledger for some time.

After you define your periodic transactions in the ledger file, you create
budget report by adding `--budget` to the command you would otherwise normally use.
E.g., to check your monthly expenses compared to the budget, you would use:

```shell script
ledger reg --budget --monthly ^expenses
```

Here's a more restricted output of

```shell script
$ ledger --budget --monthly -p "this year" reg rent
01/01/2020 - 31/01/2020            Expenses:Living:Rent         $-10.00     $-10.00
01/02/2020 - 29/02/2020            Expenses:Living:Rent          $14.00      $-4.00
01/03/2020 - 31/03/2020            Expenses:Living:Rent          $14.00      $-4.00
```

The first column with values tells you the difference between the budget and the actual amount
spent. The second column is the final running balance and doesn't provide much information
when reporting on averages or against budget.

### Examples

```text
; Exchanging currencies in a single account
2020/04/24 * Exchange
  Revolut  €400.50 @ $0.92
  Revolut

; Paying lunch for your friend
2020/04/24 * Restaurant
  Expenses:Food:Lunches  $10
  Assets:Reimbursements  $9.50 ; Payee: My Friend
  Assets:Cash

; Getting paid back for the lunch
11/02/2020 * My Friend
  Assets:Checking  $9.50
  Assets:Reimbursements  ; Payee: My Friend
```

## Summary

It might feel demanding and time-consuming to keep a financial journal,
but the benefits overweight all the negatives. Keeping a journal
provides you with enormous insight into your financial state and helps
you optimize. If you want to keep your finances at check or if you are just interested
in what you spend the most on, Ledger is the right tool for you.

