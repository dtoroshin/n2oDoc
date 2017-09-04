# Реактивные формы The Angular

## Введение в реактивные формы
 Angular предлагает две технологии для создания форм: _реактивные формы_ and _шаблонные формы_.
Эти технологии принадлежат библиотеке `@angular/forms` и имеют общий набор классов управления формами, но они заметно различаются в философии, 
стиле программирования и технике. 

### _Реактивные формы_ 
_Реактивные_ формы Angular продвигают реактивный стиль программирования, который способствует явному управлению данными, проходящими между моделью 
данных и моделью, ориентированной на пользовательский интерфейс, которая сохраняет состояния и значения элементов управления HTML на экране. 
_Реактивные_ формы обеспечивают простоту использования реактивных шаблонов, тестирования и валидации. 
С _реактивными_ формами создается дерево объектов управления Angular формой в классе компонентов и привязываете их к элементам управления собственной 
формой в шаблоне компонента. 
Объекты управления формой создаются непосредственно в классе компонентов. Поскольку класс компонента имеет непосредственный доступ как к модели данных, 
так и к структуре управления формами,  можно вывести значения модели данных в элементы формы и вытащить измененные пользователем значения. 
Компонент может наблюдать изменения и реагировать на эти изменения.
Одно из преимуществ непосредственной работы с объектами управления формой заключается в том, что обновления значения и валидности всегда синхронны. 
Не возникает проблем синхронизации, которые иногда появляются при использовании шаблонных форм. Также реактивные формы проще для модульного тестирования.
В соответствии с реактивной парадигмой компонент сохраняет неизменность модели данных, рассматривая ее как достоверный источник исходных значений. 
Вместо того, чтобы напрямую обновлять модель данных, компонент извлекает изменения пользователя и перенаправляет их на внешний компонент или сервис, 
который делает что-то с ними (например, сохранение) и возвращает новую модель данных компоненту, который отражает обновленное состояние модели.
Использование реактивных форм не требует соблюдения всех реактивных принципов, но это облегчает подход к реактивному программированию.

### _Шаблонные формы_

Элементы формы HTML размещаются (например, `<input>` и `<select>`) в шаблоне компонента и привязываете их к свойствам модели данных в компоненте, 
используя директивы, к примеру `ngModel`.
Не нужно создавать объекты управления Angular формой. Директивы Angular создают их, используя информацию в данных, при необходимости Angular обновляет 
измененную модель данных  с изменениями пользователя.
Именно по этой причине директива ngModel не является частью ReactiveFormsModule - это означает, что в классе компонента меньше кода. 
Шаблонные формы являются асинхронными, что может усложнить разработку в более сложных сценариях.


### Async vs. sync

Реактивные формы синхронны, а шаблонные - нет. Это имеет большое значение.
В реактивных формах создается все дерево управления формой в коде. Можно сразу обновить значение или развернуть потомков родительской формы, потому что
 все элементы управления всегда доступны.
Шаблонные формы поручают создание своих элементов  директивам. Чтобы избежать ошибок «changed after checked», эти директивы проходят более одного цикла 
для построения всего дерева управления. Другими словами, необходимо подождать, перед тем как манипулировать любыми элементами управления из класса компонента.
К примеру, если вводить элемент формы с помощью запроса `@ViewChild (NgForm)` и проверить его в hook-кэше `ngAfterViewInit`, обнаружится, что у него нет детей. 
Необходимо использовать `setTimeout`, перед извлечением значения из элемента управления, проверки валидности или изменением значения.
К тому же, асинхронность шаблонных форм усложняет модульное тестирование. Необходимо обернуть свой тестовый блок в `async ()` или `fakeAsync ()`, чтобы 
избежать поиска значений в форме, которая еще не существует, а в реактивных формах всегда все доступно.

### Что лучше: Реактивные или Шаблонные формы?

Невозможно определить, что лучше использовать. Это две разные архитектурные парадигмы, с их сильными и слабыми сторонами. 
Можно использовать и реактивные, и шаблонные в одном приложении.
В данном руководстве в дальнейшем речь будет идти только о реактивных формах.

## Создание модели данных
Главная часть этого руководства - компонент реактивных форм, который редактирует героя.  
Понадобится класс героя и некоторые данные героя. Создается новый файл `data-model.ts` в каталоге приложения.


<code-example path="reactive-forms/src/app/data-model.ts" title="src/app/data-model.ts" linenums="false">

</code-example>


Файл экспортирует два класса и две константы. Классы `Address` и `Hero` определяют модель данных приложения.

## Создание компонента реактивных форм
Создается новый файл с именем hero-detail.component.ts в каталоге приложения и производится импорт:


<code-example path="reactive-forms/src/app/hero-detail-1.component.ts" region="imports" title="src/app/hero-detail.component.ts" linenums="false">

</code-example>



Теперь вводится декоратор @Component, который указывает метаданные `HeroDetailComponent`:


<code-example path="reactive-forms/src/app/hero-detail.component.ts" region="metadata" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>


Затем создается экспортированный класс HeroDetailComponent с помощью `FormControl`. 
`FormControl` - это директива, которая позволяет напрямую создавать и управлять экземпляром FormControl.



<code-example path="reactive-forms/src/app/hero-detail-1.component.ts" region="v1" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



Здесь создается name экземпляра FormControl. Он будет связан в шаблоне с полем ввода HTML для имени героя. 
Конструктор FormControl принимает три необязательных аргумента: начальное значение, массив валидаторов и массив асинхронных валидаторов.

## Создание шаблона

Теперь создается шаблон компонента `src/app/hero-detail.compionent.html` со следующей разметкой:


<code-example path="reactive-forms/src/app/hero-detail-1.component.html" region="simple-control" title="src/app/hero-detail.component.html" linenums="false">

</code-example>



Чтобы Angular знал, что это вход, который необходимо связать name c `FormControl` в классе, нужно прописать `[formControl]` = «name» в шаблоне на `<input>`.


## Импорт _ReactiveFormsModule_

Шаблон `HeroDetailComponent` использует директиву `formControlName` из `ReactiveFormsModule`.
В этом примере необходимо объявить HeroDetailComponent в AppModule, поэтому в `app.module.ts` необходимо выполнить следующие три действия:

1. Использовать оператор import для доступа к `ReactiveFormsModule` и `HeroDetailComponent`.
1. Добавить `ReactiveFormsModule` в список импорта `AppModule`.
1. Добавить `HeroDetailComponent` в массив объявлений.


<code-example path="reactive-forms/src/app/app.module.ts" region="v1" title="src/app/app.module.ts (excerpt)" linenums="false">

</code-example>




## Отображение элемента _HeroDetailComponent_
Необходимо переработать шаблон `AppComponent`, так, чтобы он отобразил `HeroDetailComponent`.

<code-example path="reactive-forms/src/app/app.component.1.ts" title="src/app/app.component.ts" linenums="false">

</code-example>

### Основные классы форм

* _AbstractControl_ - абстрактный базовый класс для трех конкретных классов управления формой: `FormControl`, `FormGroup` и `FormArray`.
 Он обеспечивает их общее поведение и свойства.


* _FormControl_
отслеживает значение и валидность элемента управления отдельной формы. Он соответствует формату HTML-формы, например, input box или selector.

* _FormGroup_
отслеживает значение и валидность группы экземпляров `AbstractControl`. К свойствам группы относятся ее дочерние элементы. 
Форма верхнего уровня в компоненте - `FormGroup`.

* _FormArray_
отслеживает значение и валидность массива с числовым индексом экземпляров `AbstractControl`.



### Стилизация приложения
Добавление таблицу стилей загрузки `bootstrap` в head `index.html`:



<code-example path="reactive-forms/src/index.html" region="bootstrap" title="index.html" linenums="false">

</code-example>



Теперь, когда все подключено, браузер должен отобразить что-то вроде этого:


<figure>
  <img src="generated/images/guide/reactive-forms/just-formcontrol.png" alt="Single FormControl">
</figure>



{@a formgroup}


## Добавление FormGroup
Если же имеется несколько `FormControls`, будет удобно зарегистрировать их в родительском `FormGroup`, и делается это достаточно просто:



<code-example path="reactive-forms/src/app/hero-detail-2.component.ts" region="imports" title="src/app/hero-detail.component.ts" linenums="false">

</code-example>



В классе необходимо обернуть `FormControl` в `FormGroup` с именем heroForm следующим образом:


<code-example path="reactive-forms/src/app/hero-detail-2.component.ts" region="v2" title="src/app/hero-detail.component.ts" linenums="false">

</code-example>



Теперь, когда изменения внесены в класс, они должны быть отражены в шаблоне. Обновленный файл `hero-detail.component.html`:



<code-example path="reactive-forms/src/app/hero-detail-2.component.html" region="basic-form" title="src/app/hero-detail.component.html" linenums="false">

</code-example>



Необходимо обратить внимание, что один `input` находится в элементе формы. Атрибут novalidate в элементе `<form>` не позволяет браузеру выполнять собственные 
валидации HTML.
`FormGroup` - это директива реактивной формы, которая принимает существующий экземпляр `FormGroup` и связывает его с элементом HTML. В данном случае он 
связывает FormGroup, которая сохранена как `heroForm` с элементом формы.
Поскольку у класса теперь есть FormGroup, нужно обновить синтаксис шаблона для связывания ввода с соответствующим `FormControl` в классе компонента.
Без родительской `FormGroup`, `[formControl]` = "name" раньше работал, потому что эта директива может стоять одна, то есть работает без участия в `FormGroup`. 
Для родительской `FormGroup` для ввода name требуется прописать `formControlName = name`, чтобы связать с правильным `FormControl` в классе. 
Это выражение говорит Angular, чтобы он сначала искал родительскую FormGroup, в данном случае heroForm, а затем внутри этой группы искать `FormControl` с 
именем name.
Значение переходит в модель формы, которое возвращает `FormControl`. Чтобы увидеть модель формы, добавляется следующая строка после закрывающего тега `form`
 в файле `hero-detail.component.html`:
 
 <code-example path="reactive-forms/src/app/hero-detail-3.component.html" region="form-value-json" title="src/app/hero-detail.component.html" linenums="false">
 
 </code-example>

Функция heroForm.value возвращает модель формы. Piping через JsonPipe отображает модель как JSON в браузере:


<figure>
  <img src="generated/images/guide/reactive-forms/json-output.png" alt="JSON output">
</figure>

Исходным значением name является пустая строка. 


## Введение в _FormBuilder_

Класс `FormBuilder` помогает сделать код чище(без повторений и беспорядка). 
Чтобы использовать `FormBuilder`, нужно импортировать его в файл `hero-detail.component.ts`:


<code-example path="reactive-forms/src/app/hero-detail-3a.component.ts" region="imports" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



Используя `FormBuilder`, можно преобразовать `HeroDetailComponent` во что-то, что немного легче читать и писать, если следовать следующему плану:


* Явно объявить тип свойства `heroForm` как `FormGroup`
* Внести `FormBuilder` в конструктор
* Добавить новый метод, который использует `FormBuilder` для определения `heroForm`
* Вызвать `createForm` в конструкторе

Получившийся `HeroDetailComponent` должен выглядеть следующим образом:

<code-example path="reactive-forms/src/app/hero-detail-3a.component.ts" region="v3a" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



`FormBuilder.group` - это фабричный метод, который создает `FormGroup`. `FormBuilder.group` принимает объект, ключи и значения которого являются именами
 `FormControl` и их определениями. В данном примере управление name определяется его начальным значением данных,  сейчас - пустой строкой.


Определение группы элементов управления в одном объекте создает компактный, читаемый код. 



{@a validators}


### Validators.required
Данный гайд не углубляется в валидацию, но вот один пример, демонстрирующий простоту использования `Validators.required` в реактивных формах. 


Для начала импортируется Validators

<code-example path="reactive-forms/src/app/hero-detail-3.component.ts" region="imports" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



Чтобы сделать поле `name` `required`,  заменяется свойство name в `FormGroup` на массив. Первый элемент - это начальное значение name; Второй - обязательный валидатор, `Validators.required`.



<code-example path="reactive-forms/src/app/hero-detail-3.component.ts" region="required" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>


<code-example path="reactive-forms/src/app/hero-detail-3.component.html" region="form-value-json" title="src/app/hero-detail.component.html (excerpt)" linenums="false">

</code-example>



Браузер отобразит следующее:


<figure>
  <img src="generated/images/guide/reactive-forms/validators-json-output.png" alt="Single FormControl">
</figure>



Статус `INVALID`, т.к поле ввода пустое. Можно написать туда что-нибудь, тогда статус сменится на `VALID`.



### Больше FormControls
У героя может быть не только имя, но и адрес, суперсила, а иногда и друг.
В случае с адресом, пользователю будет предложено выбрать из списка штатов (`<select>`, содержащий `<option>` элементы со штатами). 
Поэтому необходимо импортировать states из `data-model.ts`

<code-example path="reactive-forms/src/app/hero-detail-4.component.ts" region="imports" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



Объявляется проперти `states` и добавляется несколько адресов в `heroForm`


<code-example path="reactive-forms/src/app/hero-detail-4.component.ts" region="v4" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



Затем требуется добавить соответствующую разметку в файле `hero-detail.component.html` в элементе формы.



<code-example path="reactive-forms/src/app/hero-detail-4.component.html" title="src/app/hero-detail.component.html" linenums="false">

</code-example>



Измененный шаблон содержит больше инпутов, селектбокс для states, радио-кнопки для суперсилы, чекбокс для `sidekick`.
Нужно обязательно связать значение option с `[value] = "state"`. Если этого не сделать, селект будет показывать значение первого option из модели данных.
Класс компонента определяет свойства управления без учета их представления в шаблоне. Требуется определить элементы `state`, `power` и `sidekick` так же, 
как определено управление `name`. 
Аналогичным образом привязываются эти элементы управления к HTML-элементам шаблона, указывается имя `FormControl` директивой `formControlName`.



{@a grouping}


### Вложенные  FormGroups

Форма становится большой и громоздкой, поэтому можно сгруппировать некоторые из связанных FormControls во вложенную группу `FormGroup`. 
`Street`, `city`, `zip code`, `state` вместе являются хорошей `FormGroup` с именем _adress_. 
Вложенные группы и элементы управления таким образом позволяют отражать иерархическую структуру модели данных и помогают отслеживать проверку и 
валидность соответствующих наборов элементов. Ранее использовалась `FormBuilder` для создания одной `FormGroup` в компоненте `heroForm`, пусть это будет 
родительская группа форм. Снова необходимо использовать `FormBuilder` для создания дочерней FormGroup, которая инкапсулирует элементы управления адресами; 
Присваивается результат новому свойству _adress_ родительской `FormGroup`.

<code-example path="reactive-forms/src/app/hero-detail-5.component.ts" region="v5" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>

Структуру элементов управления формы в классе компонентов изменена, теперь нужно внести соответствующие корректировки в шаблон компонента. 
Добавляется директиву `formGroupName` в div и привязывается к «adress». 
Чтобы увидеть эти изменения, требуется изменить `hero-detail.component.html` следующим образом:


<code-example path="reactive-forms/src/app/hero-detail-5.component.html" region="add-group" title="src/app/hero-detail.component.html (excerpt)" linenums="false">

</code-example>



После этих изменений вывод JSON в браузере показывает измененную модель формы с вложенным адресом `FormGroup`:


<figure>
  <img src="generated/images/guide/reactive-forms/address-group.png" alt="JSON output">
</figure>



{@a properties}


## Проверка свойств _FormControl_
Можно проверить отдельный `FormControl` в форме, извлекая его методом `.get ()`. Также возможно отобразить значение на странице, добавив следующее:



<code-example path="reactive-forms/src/app/hero-detail-5.component.html" region="inspect-value" title="src/app/hero-detail.component.html" linenums="false">

</code-example>



Чтобы получить состояние `FormControl`, находящееся внутри `FormGroup`, используется точка для прописывания пути к элементу управления.


<code-example path="reactive-forms/src/app/hero-detail-5.component.html" region="inspect-child-control" title="src/app/hero-detail.component.html" linenums="false">

</code-example>



Можно использовать эту технику для отображения любого свойства `FormControl`, например, одного из следующих:


<style>
  td, th {vertical-align: top}
</style>



<table width="100%">

  <col width="10%">

  </col>

  <col width="90%">

  </col>

  <tr>

    <th>
      Property
    </th>

    <th>
      Description
    </th>

  </tr>

  <tr>

    <td>
      <code>myControl.value</code>
    </td>

    <td>


      значение FormControl
    </td>

  </tr>

  <tr>

    <td>
      <code>myControl.status</code>
    </td>

    <td>


      валидность FormControl. Возможные значения: VALID, INVALID, PENDING или DISABLED

    </td>

  </tr>

  <tr>

    <td>
      <code>myControl.pristine</code>
    </td>

    <td>


      true, если пользователь не менял значение. Противоположностью является myControl.dirty
    </td>

  </tr>

</table>


## Модель данных и модель формы

На данный момент форма отображает пустые значения, но `HeroDetailComponent` должен отображать значения героя, возможно, полученного с удаленного сервера. 
Сейчас `HeroDetailComponent` получает своего героя от родителя `HeroListComponent`.
`hero` с сервера - это модель данных. Структура `FormControl` - это модель формы.
Компонент должен скопировать значения героя в модели данных в модель формы. Есть два важных момента:

1. Разработчик должен понять, как свойства модели данных сопоставляются с свойствами модели формы.

2. Пользователь изменяет поток из элементов DOM в модель формы, а не в модель данных, а элементы управления формы никогда не обновляют модель данных.

Структуры форм и моделей данных не обязательно совпадают, но в HeroDetailComponent две модели довольно близки.


## Заполнение формы модели, используя _setValue_ и _patchValue_

Ранее создан элемент управления и одновременно инициализировали его значение. 
Также можно инициализировать или сбросить значения позже с помощью методов `setValue` и `patchValue`.


### _setValue_
С помощью `setValue` сразу назначается каждое значение, передавая объект данных, свойства которого точно соответствуют модели формы `FormGroup`.



<code-example path="reactive-forms/src/app/hero-detail-7.component.ts" region="set-value" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



Метод `setValue` тщательно проверяет объект данных перед назначением значений. 
Необходимо обратить внимание, что можно использовать `hero` как аргумент `setValue`, потому что его форма похожа на структуру `FormGroup` компонента. 
Можно показать только первый адрес героя, но необходимо учитывать возможность того, что у героя нет адресов вообще.



### _patchValue_
С помощью функции `patchValue` вы можете назначать значения определенным элементам `FormGroup`, предоставляя объект пар ключ / значение только для интересующих элементов.
Далее устанавливается только управление именем:

<code-example path="reactive-forms/src/app/hero-detail-6.component.ts" region="patch-value" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



С `patchValue` больше гибкости, чтобы справляться с различающимися данными и формами моделей.Но в отличие от `setValue`, 
`patchValue` не может проверять недостающие значения и не вызывает ошибок.


### Когда устанавливать значения в форму (ngOnChanges)

Теперь ясно, как устанавливать значения модели. Но когда их необходимо устанавливать? Ответ зависит от того, когда компонент получает значения модели данных.
HeroDetailComponent вложен в `HeroListComponent`, а `HeroListComponent` отображает имена героев. Когда пользователь нажимает на героя, компонент списка передает 
выбранного героя в `HeroDetailComponent`, привязывая его к полю ввода героя.


<code-example path="reactive-forms/src/app/hero-list.component.1.html" title="hero-list.component.html (simplified)" linenums="false">

</code-example>



В этом подходе значение hero в HeroDetailComponent изменяется каждый раз, когда пользователь выбирает нового героя. Необходимо вызвать `setValue` 
вместе с `ngOnChanges`, который вызывает Angular методы всякий раз, когда свойство hero изменяется.
Сначала импортируется `OnChanges` и `Input` в файле `hero-detail.component.ts`.


<code-example path="reactive-forms/src/app/hero-detail-6.component.ts" region="import-input" title="src/app/hero-detail.component.ts (core imports)" linenums="false">

</code-example>



Добавьте `hero` `Input`.


<code-example path="reactive-forms/src/app/hero-detail-6.component.ts" region="hero" title="src/app/hero-detail-6.component.ts" linenums="false">

</code-example>



Добавьте метод `ngOnChanges` в класс следующим образом:



<code-example path="reactive-forms/src/app/hero-detail-7.component.ts" region="ngOnChanges-1" title="src/app/hero-detail.component.ts (ngOnchanges)" linenums="false">

</code-example>



### _reset_ флагов формы

При смене героя, необходимо всегда сбрасывать форму, чтобы значения от предыдущего героя были очищены, а статусные флаги восстановлены в 
первоначальное состояние. reset можно вызвать таким образом:


<code-example path="reactive-forms/src/app/hero-detail-7.component.ts" region="reset" title="src/app/hero-detail-7.component.ts" linenums="false">

</code-example>



Метод reset имеет необязательное значение состояния, так что можно одновременно сбросить флаги и значения. Внутри reset передает аргумент `setValue`. 
После небольшого рефакторинга `ngOnChanges` становится следующим:


<code-example path="reactive-forms/src/app/hero-detail-7.component.ts" region="ngOnChanges" title="src/app/hero-detail.component.ts (ngOnchanges - revised)" linenums="false">

</code-example>



{@a hero-list}


### Создание _HeroListComponent_ и _HeroService_

`HeroDetailComponent` является вложенным подкомпонентом компонента `HeroListComponent` в представлении `master/detail`. Вместе они выглядят примерно так:



<figure>
  <img src="generated/images/guide/reactive-forms/hero-list.png" alt="HeroListComponent">
</figure>



HeroListComponent использует внедренный `HeroService` для извлечения героев с сервера, а затем отображает этих героев пользователю в виде серии кнопок. 
В данном случае HeroService эмулирует HTTP-сервис.
Когда пользователь нажимает на героя, компонент устанавливает `selectedHero`, который привязан к полю ввода hero в `HeroDetailComponent`. 
HeroDetailComponent обнаруживает измененного героя и изменяет форму с значениями этого героя. 
Кнопка «Refresh» очищает и список героев, и текущего выбранного героя, перед тем как заново показать героев.



{@a form-array}


## Использование _FormArray_ для представления массива _FormGroups_

Ранее использовался только FormControls и FormGroups. FormGroup - объект, значениями свойств которого являются FormControls и другие FormGroups.
Свойство Hero.addresses представляет собой массив экземпляров адреса. adress FormGroup может отображать ровно один Adress, а FormArray может отображать массив из adress. 
Чтобы получить доступ к классу FormArray, необходимо импортировать его в файл hero-detail.component.ts:

<code-example path="reactive-forms/src/app/hero-detail-8.component.ts" region="imports" title="src/app/hero-detail.component.ts (excerpt)" linenums="false">

</code-example>



Работа с FormArray заключается в следующем:


1. Определить элементы (`FormControls` или `FormGroups`) в массиве.

1. Инициализировать массив элементами, созданными из данных в _data model_.

1. Добавлять и удалять элементы по мере необходимости.

Нужно будет переопределить модель формы в конструкторе `HeroDetailComponent`, который в настоящее время отображает только первый адрес героя.


<code-example path="reactive-forms/src/app/hero-detail-7.component.ts" region="address-form-group" title="src/app/hero-detail-7.component.ts" linenums="false">

</code-example>



### От адреса к секретным логовам

С точки зрения пользователя, у героев нет адресов, ведь адреса предназначены для простых смертных. Герои проживают в секретных логовах! Необходимо заменить `adres` `FormGroup` на secretLairs `FormArray`:


<code-example path="reactive-forms/src/app/hero-detail-8.component.ts" region="secretLairs-form-array" title="src/app/hero-detail-8.component.ts" linenums="false">

</code-example>



### Инициализация secretLairs FormArray

По умолчанию в форме отображается безымянный герой без адресов. Теперь необходим метод для заполнения `secretLairs` реальными адресами героев:
Следующий `метод setAddresses` заменяет secretLairs `FormArray` новым `FormArray`:

<code-example path="reactive-forms/src/app/hero-detail-8.component.ts" region="set-addresses" title="src/app/hero-detail-8.component.ts" linenums="false">

</code-example>

### Получение _FormArray_
`HeroDetailComponent` должен иметь возможность отображать, добавлять и удалять элементы из secretArray.  
Для получения ссылки на этот FormArray используется метод `FormGroup.get`:


<code-example path="reactive-forms/src/app/hero-detail-8.component.ts" region="get-secret-lairs" title="src/app/hero-detail.component.ts (secretLayers property)" linenums="false">

</code-example>



### Отображение _FormArray_

В текущем HTML-шаблоне отображается только один адрес `FormGroup`, поэтому необходимо сделать так, чтобы отображались все адреса. 
Это можно сделать используя `*ngFor`, предварительно обвернув необходимое содержимое тегом `<div>`.
Но необходимо понимать, как писать `*ngFor`. Существует три ключевых момента:

1. Нужно добавить еще один `<div>`, вокруг `<div>` с помощью `*ngFor`, и установить директиву `formArrayName` для «secretLairs». 
Это установит `secretLairs` `FormArray` как контекст для элементов управления формой во внутреннем шаблоне HTML.

1. Источником повторяющихся элементов является `FormArray.controls`, а не сам `FormArray`. 

1. Каждой повторной группе `FormGroup` требуется уникальная `formGroupName`, которая должна быть индексом `FormGroup` в `FormArray`.


Вот скелет для секции секретных логов HTML-шаблона:

<code-example path="reactive-forms/src/app/hero-detail-8.component.html" region="form-array-skeleton" title="src/app/hero-detail.component.html (*ngFor)" linenums="false">

</code-example>



Вот полный шаблон для секретных логов:

<code-example path="reactive-forms/src/app/hero-detail-8.component.html" region="form-array" title="src/app/hero-detail.component.html (excerpt)">

</code-example>



### Добавление нового логова в _FormArray_


Нужно добавить метод `addLair`, который получает `secretLairs` и добавляет туда новый адрес.

<code-example path="reactive-forms/src/app/hero-detail-8.component.ts" region="add-lair" title="src/app/hero-detail.component.ts (addLair method)" linenums="false">

</code-example>



Кнопка помещается в форму, чтобы пользователь мог добавить новое тайное логово и подключается к методу `addLair` компонента.


<code-example path="reactive-forms/src/app/hero-detail-8.component.html" region="add-lair" title="src/app/hero-detail.component.html (addLair button)" linenums="false">

</code-example>


## Наблюдение за изменениями 

Angular вызывает `ngOnChanges`, когда пользователь выбирает героя в родительском `HeroListComponent`, 
выбор героя изменяет поле `HeroDetailComponent.hero`, но Angular не вызывает `ngOnChanges`, когда пользователь изменяет имя героя или секретные логова. 
К счастью, возможно узнать о таких изменениях, подписавшись на одно из свойств form control, которое вызывает событие изменения. Это свойства, такие как 
`valueChanges`, которые возвращают RxJS Observable. 
Нужно следующий метод, чтобы было возможно отслеживать изменения:

<code-example path="reactive-forms/src/app/hero-detail.component.ts" region="log-name-change" title="src/app/hero-detail.component.ts (logNameChange)" linenums="false">

</code-example>



Он вызывается в конструкторе, после создания формы

<code-example path="reactive-forms/src/app/hero-detail-8.component.ts" region="ctor" title="src/app/hero-detail-8.component.ts" linenums="false">

</code-example>



Метод `logNameChange` добавляет значения изменения имени в массив `nameChangeLog` Необходимо отобразить этот массив в нижней части шаблона компонента
 с помощью `*ngFor`:


<code-example path="reactive-forms/src/app/hero-detail.component.html" region="name-change-log" title="src/app/hero-detail.component.html (Name change log)" linenums="false">

</code-example>


## Cохранение данных формы

`HeroDetailComponent` перехватывает пользовательский ввод, но он ничего не делает с ним. 
В реальном приложении было бы необходимо сохранять эти данные. 
В реальном приложении возможно вернуть несохраненные изменения и возобновить редактирование. 
После реализации обеих функций форма будет выглядеть так:


<figure>
  <img src="generated/images/guide/reactive-forms/save-revert-buttons.png" alt="Form with save & revert buttons">
</figure>



### Save
Когда пользователь отправляет форму, `HeroDetailComponent` передает экземпляр модели данных героя методу сохранения `HeroService`.


<code-example path="reactive-forms/src/app/hero-detail.component.ts" region="on-submit" title="src/app/hero-detail.component.ts (onSubmit)" linenums="false">

</code-example>



У первого героя изначально были сохранены какие-то данные, а изменения пользователя по-прежнему находятся в форме. 
Таким образом, создается новый герой из 
комбинации уникальных значений героя `(hero.id)` и других копий измененных значений модели, используя помощник prepareSaveHero.


<code-example path="reactive-forms/src/app/hero-detail.component.ts" region="prepare-save-hero" title="src/app/hero-detail.component.ts (prepareSaveHero)" linenums="false">

</code-example>

### Revert (сброс изменений)
При нажатии кнопки Revert, пользователь отменяет изменения и возвращает форму в исходное состояние:

<code-example path="reactive-forms/src/app/hero-detail.component.ts" region="revert" title="src/app/hero-detail.component.ts (revert)" linenums="false">

</code-example>



### Кнопки
Нужно добавить кнопки Save и Revert  на HTML шаблон:

<code-example path="reactive-forms/src/app/hero-detail.component.html" region="buttons" title="src/app/hero-detail.component.html (Save and Revert buttons)" linenums="false">

</code-example>

Кнопки отключены до тех пор, пока пользователь не запустит форму, изменив значение в любом из элементов формы `heroForm.dirty`. 
Нажатие кнопки типа «submit» запускает событие ngSubmit, которое вызывает метод `onSubmit` компонента. 
Щелчок по кнопке Revert вызывает метод сброса компонента. 
Теперь пользователи могут сохранять или отменять изменения.
