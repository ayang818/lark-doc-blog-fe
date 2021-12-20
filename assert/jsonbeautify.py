res=''
with open('assert/tmp.json', 'r') as f:
    res = f.read()

import json
from json import encoder
res_dict = json.loads(res)
# print(res_dict['content'])
import pyperclip

pyperclip.copy(res_dict['content'])