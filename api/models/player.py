class Player:
    def __init__(self,id:int,name:str):
        self.id = id
        self.name = name
        pass

    def to_json(self):
        return {
            'id':self.id,
            'name':self.name
        }    