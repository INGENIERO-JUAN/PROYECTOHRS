import zipfile
import xml.etree.ElementTree as ET
import json
import re
import os

DOCX_PATH = 'C:/Users/PERSONAL/.gemini/antigravity/brain/6eb7082b-f46f-43f1-9d90-797b9d5a6e52/.user_uploaded/media_1793581694469_2751c153.docx'
JSON_PATH = 'src/data/mallaCurricularEspanol.json'

with open(JSON_PATH, 'r', encoding='utf-8') as f:
    existing_malla = json.load(f)

# Extract tables from DOCX
with zipfile.ZipFile(DOCX_PATH) as z:
    xml_content = z.read('word/document.xml')
    tree = ET.fromstring(xml_content)

namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
tables = tree.findall('.//{http://schemas.openxmlformats.org/wordprocessingml/2006/main}tbl')

def clean_txt(text):
    if not text: return ""
    text = re.sub(r'[\x00-\x1f\x7f-\x9f]', ' ', text)
    text = text.replace('\xa0', ' ').replace('', 'ñ') # Word encoding fix
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def parse_table_rows(tbl):
    rows = []
    for tr in tbl.findall('w:tr', namespaces):
        cells = [clean_txt(''.join(tc.itertext())) for tc in tr.findall('w:tc', namespaces)]
        rows.append(cells)
    return rows

print(f"Total tables: {len(tables)}")
