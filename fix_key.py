import sys

p = 'apps/reference-app/src/pages/CohortListPage.tsx'
with open(p) as f:
    lines = f.readlines()

# Find the actionsColumn definition and change its key from 'id' to 'modifiedDate'
found = False
for i, line in enumerate(lines):
    if "'id' as keyof CohortDefinition" in line and not found:
        # This is the actionsColumn line (the only one with 'as keyof')
        lines[i] = line.replace("'id' as keyof CohortDefinition", "'modifiedDate' as keyof CohortDefinition")
        found = True
        print(f"Fixed line {i+1}: {lines[i].strip()}")

if found:
    with open(p, 'w') as f:
        f.writelines(lines)
    print("File updated successfully")
else:
    print("Pattern not found")
