import requests
import json


headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
}
id = 484635205
url = "https://quizlet.com/webapi/3.4/studiable-item-documents?filters%5BstudiableContainerId%5D={}&filters%5BstudiableContainerType%5D=1&perPage=1000&page=1".format(id)
itemsResponse = requests.get(url, verify=False, headers=headers)

print(itemsResponse)

rawJson = {"studiableDocumentData": json.loads(
                itemsResponse.text)["responses"][0]["models"]}
terms = []
definitions = []


for flashcard in rawJson["studiableDocumentData"]["studiableItem"]:
    terms.append(flashcard["cardSides"][0]["media"][0]["plainText"])
    definitions.append(flashcard["cardSides"][1]["media"][0]["plainText"])

flashcard = rawJson["studiableDocumentData"]["studiableItem"][0]

print(terms)
print(definitions)