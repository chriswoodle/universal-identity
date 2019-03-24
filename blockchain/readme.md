# blockchain server

# Setup
```
pip install -r requirements.txt 
```

# Run
```
python3 server.py
```

# API

```
POST /transactions/new
{
"userId": "009",
"userSecret": "some secret",
"action": "created transaction"
}
```
```
GET /mine
mines unconfirmed transactions
returns current block
```

```
GET /chain
returns all mined blocks
```