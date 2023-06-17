import React from 'react'
import request from 'superagent'

class Show extends React.Component {
    constructor(props) {
	super(props)
	this.state = {
	    date: '2023-01-01', id: '1234', content:'text', jump: '',  loaded: false
	}
    }

    componentWillMount() {
	request.get('/api/get')
	    .query({
		//dates:["2023-01-01"],
		//ids:['1234']
	    })
	    .end((err, res) => {
		if(err) {
		    console.log(res.msg)
		    return
		}
		this.setState({
		    body: res.body.data,
		    loaded: true
		})
	    })
    }
    render() {
	if(!this.state.loaded) return (<p>読み込み中</p>)
	if(this.state.jump !== '') {
	    return <Redirect to = {this.state.jump} />
	}
	console.log(this.state.body)
	const html = this.text(this.state.body)
	return(<div><div>{html}</div>
		   <textarea rows={1} cols={50}
			     onChange={e => this.dateChanged(e)}
			     value={this.state.date} /><br />
		   <textarea rows={1} cols={50}
			     onChange={e => this.idChanged(e)}
			     value={this.state.id} /><br />
		   <textarea rows={1} cols={50}
			     onChange={e => this.contentChanged(e)}
			     value={this.state.content} /><br />
		   <button onClick={e => this.save()}>追加テスト</button><br />
		   <button onClick={e => this.del()}>削除テスト</button>
	       </div>)
    }
    dateChanged(e) {
	this.setState({date: e.target.value})
    }
    idChanged(e) {
	this.setState({id: e.target.value})
    }
    contentChanged(e) {
	this.setState({content: e.target.value})
    }
    text(body) {
	const lines = body.map((v, i) => {
	    if(i === 0 || v.date !== body[i - 1].date) {
		return (<div><b>{v.date.split('T')[0]}</b><br />{v.id}:{v.content}<br /></div>)
	    }
	    return (<div>{v.id}:{v.content}<br /></div>)
	})
	return lines
    }
    save() {
	request.post('/app/put').type('form')
	    .send({
		date: this.state.date,
		id: this.state.id,
		content: this.state.content 
	    })
	    .end((err, data) => {
		if(err) {
		    console.log(err)
		    return
		}
		console.log("post OK")
		this.setState({jump: '/'})
	    })
    }
    del() {
	request.post('/app/del').type('form')
	    .send({
		date: this.state.date,
		id: this.state.id,
		content: this.state.content
	    })
	    .end((err, data) => {
		if(err) {
		    console.log(err)
		    return
		}
		console.log("del OK")
		this.setState({jump: '/'})
	    })
    }
}
export default Show
