const vel = new Vel(Vel.feedbackLanguage.pt);

const linkA = async () => {
  vel.url =
    'https://raw.githubusercontent.com/charleslana/naruto-legacy-client/master/pages/';
  vel.object = 'main';
  await vel.routePage('home');
  vel.callback = Vel.typeCallback.text;
  const result = vel.getId('pageHome');
  console.log(result);
  const hash = window.location.hash.substring(2);
  console.log(hash);
};

const linkB = async () => {
  vel.url = 'https://viacep.com.br/ws/01001000/json/';
  await vel.fetchData(Vel.methodFetchData.get);
  const result = vel.data;
  console.log(result);
  vel.object = result['localidade'];
  vel.callback = Vel.typeCallback.text;
  vel.setId('main');
};

vel.callback = Vel.typeCallback.click;
vel.listObject = [linkA, linkB];
vel.setListId(['link_a', 'link_b']);
