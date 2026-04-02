import zipfile
import xml.etree.ElementTree as ET
import sys

def extract_text_from_docx(docx_path):
    try:
        with zipfile.ZipFile(docx_path) as zf:
            xml_content = zf.read('word/document.xml')
        tree = ET.fromstring(xml_content)
        ns = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
        paragraphs = []
        for paragraph in tree.iter(ns + 'p'):
            texts = [node.text for node in paragraph.iter(ns + 't') if node.text]
            if texts:
                paragraphs.append(''.join(texts))
            else:
                paragraphs.append('') # keep empty lines
        return '\n'.join(paragraphs)
    except Exception as e:
        return str(e)

code = extract_text_from_docx(sys.argv[1])
with open("extracted_code.jsx", "w", encoding="utf-8") as f:
    f.write(code)
print("Extracted to extracted_code.jsx", flush=True)
