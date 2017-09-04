Развертывание:
git clone https://github.com/dtoroshin/n2oDoc.git
cd n2oDoc
npm install
cd aio
npm install
yarn
yarn docs
yarn start


Добавление документа

1. cd n2oDoc/aio/content/guide
Создать документ *.md с соответствующей разметкой.

2. n2oDoc/aio/content/navigation.json
Прописать линки к созданному документу
Пример:
{
      "url": "guide/test",
      "title": "test",
      "tooltip": "fffff"
}
Пример с вложенностью пунктов меню:
{
      "title": "Fundamentals",
      "tooltip": "The fundamentals of Angular",
      "children": [
        {
          "title": "Forms",
          "tooltip": "Angular Forms",
          "children": [
            {
              "url": "guide/reactive-forms",
              "title": "Reactive Forms",
              "tooltip": "Create a reactive form using FormBuilder, groups, and arrays."
            } 
           ]
        }
]}

3. После добавления документа необходимо выполнить: 
yarn docs 
yarn start

Также необходимо добавить изменения в git репозиторий.
