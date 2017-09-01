from win32com import client as wc

word = wc.Dispatch('Word.Application')

doc = word.Documents.Open('d:/labs/math.doc')

doc.SaveAs('d:/labs/math.html', 8)

doc.Close()

word.Quit()