Dobrý den, Chtěl bych napsat krátký popis této aplikace. 

Strávil jsem spoustu času hledáním dobrého bezplatného rozhraní api. Bohužel všechny volné api lze přijímat pouze text, nikoli pole objektů, jak bych chtěl, na to potřebuji na každý prvek v tabulce posílat žádost, že není produktivní, tak jsem sundala výsledek v nový json soubor a pak s ním pracoval. 

Použil jsem pouze prvních 5 prvků z vašeho csv souboru, protože všechny api má omezení na 500 prvků a bohužel jsem nemohl vyzkoušet všechny prvky, takže testovací data jsou uložena v myData.csv souboru.

Dále jsem použil ```createReadStream```k vyplnění pole po jednom řádku tak, aby to bylo rychlé. Chtěl bych říct, že jsem měl mnoho omezení api, a tak to není zrovna produktivní možnost aplikace vzhledem k tomu, cyklus v cyklu, který je nˆ2 , já to chápu.

Pokud mi nabídnete jiné řešení včetně omezení api, rád bych vás uslišet.

Jsme programátoři rychle se učíme!
