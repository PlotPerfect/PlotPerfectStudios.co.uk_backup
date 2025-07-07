import os
import glob
import re

import pytest

CANONICAL_REGEX = re.compile(r'<link[^>]+rel=["\"]canonical["\"][^>]*>', re.IGNORECASE)

HTML_GLOB = os.path.join(os.path.dirname(os.path.dirname(__file__)), '*.html')

# Exclude admin.html from canonical link checks
EXCLUDED_FILES = {'admin.html'}

html_files = [f for f in glob.glob(HTML_GLOB) if os.path.basename(f) not in EXCLUDED_FILES]

@pytest.mark.parametrize('html_file', html_files)
def test_canonical_link_present(html_file):
    with open(html_file, encoding='utf-8') as f:
        content = f.read()
    assert CANONICAL_REGEX.search(content), f"Missing <link rel=\"canonical\"> in {os.path.basename(html_file)}"
