import os
import json
import requests

NOTION_TOKEN = os.getenv("NOTION_TOKEN")
DATABASE_ID = os.getenv("NOTION_DATABASE_ID")

headers = {
    "Authorization": f"Bearer {NOTION_TOKEN}",
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28"
}

def fetch_notion_data():
    url = f"https://api.notion.com/v1/databases/{DATABASE_ID}/query"
    
    # Filtrage : On ne récupère que si la Note est >= 7
    payload = {
        "filter": {
            "property": "Note",
            "number": { "greater_than_or_equal_to": 7 }
        },
        "sorts": [
            { "property": "Date", "direction": "descending" }
        ]
    }
    
    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status() # Erreur si l'API répond mal
    data = response.json()
    
    articles = []
    for page in data.get("results", []):
        props = page["properties"]
        
        # Extraction sécurisée des données
        titre = props["Nom"]["title"][0]["text"]["content"] if props.get("Nom") and props["Nom"]["title"] else "Sans titre"
        url_link = props["URL"]["url"] if props.get("URL") else "#"
        synthese = props["Synthèse"]["rich_text"][0]["text"]["content"] if props.get("Synthèse") and props["Synthèse"]["rich_text"] else "Aucune synthèse disponible."
        
        # Pour les multi-select (Tags), on les rejoint avec des virgules
        tags_list = [t["name"] for t in props["Tags"]["multi_select"]] if props.get("Tags") else ["Tech"]
        tags_string = ", ".join(tags_list)

        # La date automatique de Notion (Created Time) ou ta colonne Date
        date_val = props["Date"]["date"]["start"] if props.get("Date") and props["Date"]["date"] else page["created_time"]

        articles.append({
            "Titre": titre,
            "URL": url_link,
            "Resume": synthese,
            "Theme": tags_string,
            "Date": date_val
        })
    return articles

if __name__ == "__main__":
    try:
        articles_data = fetch_notion_data()
        os.makedirs("data", exist_ok=True)
        with open("data/articles.json", "w", encoding="utf-8") as f:
            json.dump(articles_data, f, ensure_ascii=False, indent=4)
        print(f"Succès : {len(articles_data)} articles exportés.")
    except Exception as e:
        print(f"Erreur : {e}")
        exit(1)
