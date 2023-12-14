import itertools

flips = []
for i in range(6):
    flips.append(True)
for i in range(5):
    flips.append(False)

total = 0
ct = 0
for i in itertools.permutations(flips):
    runs = 1
    last = i[0]
    for j in i:
        if last != j:
            runs += 1
        last = j
    if runs >= 8:
        ct += 1
    total += 1

print(ct)
print(total)
print(ct / total)