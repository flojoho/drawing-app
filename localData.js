const localData = (() => {
  let data;

  const localEntry = localStorage.getItem('drawing app');

  if (typeof localEntry === 'string'){
    data = JSON.parse(localEntry);
  } else {
    data = {
      currentId: 0,
      drawings: {
        0: []
      }
    };
  }


  return {
    getPaths(id){
      return data.drawings[id];
    },
    
    getDrawings(){
      return data.drawings;
    },

    save(){
      localStorage.setItem('drawing app', JSON.stringify(data));
    },

    addPathToDrawing(id, path){
      data.drawings[id].push(path);
      this.save();
    },

    updateDrawings(drawings){
      data.drawings = drawings;
      this.save();
    },

    getUniqueId(){
      const newId = ++data.currentId;
      console.log(data.currentId);
      //this.save();
      return newId;
    },

    createDrawing(){
      const newId = this.getUniqueId();
      data.drawings[newId] = [];
      this.save();

      return newId;
    },
  }
})();