import React, { Component } from 'react';

import axios from 'axios';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';

export default class DashboardPage extends Component {

    state = {
        deleteVisibility:false,
        searchKey: '',
        searchResults: [],
        newData: [],
        page:11,
        selectedItems:[]
    }

    handleSearchFocus = () => {
        if(this.state.searchKey.trim() != '')
            document.getElementById('searchResults').style.display = 'block';
    }

    handleSearchChange = async (e) => {
        this.setState({
            searchKey:e.target.value,
        });

        if(e.target.value.trim() != '') {
            document.getElementById('searchResults').style.display = 'block';
            this.setState({
                deleteVisibility:true,
            });

            try{
                const data = await axios.get('https://rxnav.nlm.nih.gov/REST/Prescribe/displaynames.json');

                const newData = data.data.displayTermsList.term.filter(p => p.includes(this.state.searchKey)).sort((a,b) => {
                    return a.length - b.length;
                });

                document.getElementById('searchResults').scrollTo({
                    'behavior': 'smooth',
                    'top': 1
                });

                this.setState({
                    page:11,
                    newData: newData,
                    searchResults:newData.slice(0, 11),
                });
            }catch(e){
                console.log(e);
            }

        }else {
            document.getElementById('searchResults').style.display = 'none';
            this.setState({
                deleteVisibility:false,
            });

        }
    }

    handleSearchBlur = (e) => {


        document.getElementById('searchResults').style.display = 'none';
    }

    handleResetSearch = (e) => {

        console.log('trigger')
        this.setState({
            deleteVisibility:false,
            searchKey: '',
            newData:[]
        });

        document.getElementById('searchResults').style.display = 'none';
    }

    handleMore = (e) => {
        e.preventDefault();
        const page = (this.state.page+11) < this.state.newData.length ? this.state.page+11 : this.state.newData.length;
        this.setState({
            page: page,
            searchResults:this.state.newData.slice(0, page),
        });
        document.getElementById('searchResults').style.display = 'block';
    }

    handleDrugClick = (e) => {
        this.state.selectedItems.push(e);
    }

  render() {
    return (
        <div id={'main'}>

            <header className={'row mr-0 ml-0 menu'} id={'header'}>
                <div className={'col-lg-12 p-0 menuArea'}>
                    <ul>
                        <li>
                            <span className={'link'}>
                              <a href={''} >Topluluğa katıl</a>
                            </span>
                        </li>
                    </ul>
                </div>
            </header>

            <main className={'row mr-0 ml-0'} id={'content'}>
                <div className={'row'}>
                    <div id={'searchBoxArea'}>
                        <div id={'searchBox'}  onBlur={this.handleSearchBlur} >

                            <div className={'active'} id={'searchBoxHead'}   >


                                <svg width={'21'} height={'21'} fill="#C0C2CC" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>

                                <input
                                    type={'text'}
                                    value={this.state.searchKey}
                                    id={'searchInput'}
                                    placeholder={'Etkileşim ara'}
                                    onChange={this.handleSearchChange}
                                    onFocus={this.handleSearchFocus}
                                    autoComplete="off"
                                />

                                {this.state.deleteVisibility &&
                                <span id={'deleteSearch'} onMouseDown={this.handleResetSearch}>
                                    <svg onClick={this.handleResetSearch} width={'21'} height={'21'} fill="#C0C2CC"
                                         xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path
                                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
                                </span>
                                }

                            </div>

                            <div className={'searchResults'} id={'searchResults'}>
                                <ul>

                                    {
                                        this.state.searchResults.length > 0 ?
                                            this.state.searchResults.map(e => {
                                                return <li key={e} className={'resultLi'} onMouseDown={() => this.handleDrugClick(e)}>
                                                    <svg fill={'#C0C2CC'}  height="18" viewBox="0 0 512 512" width="18" xmlns="http://www.w3.org/2000/svg"><path d="m512 126.101562c0-33.699218-13.121094-65.382812-36.953125-89.210937-49.1875-49.1875-129.226563-49.1875-178.417969 0l-119.230468 119.234375 178.417968 178.417969 119.230469-119.234375c23.832031-23.828125 36.953125-55.511719 36.953125-89.207032zm0 0"/><path d="m156.183594 177.335938-119.230469 119.234374c-23.832031 23.828126-36.953125 55.507813-36.953125 89.210938 0 33.695312 13.121094 65.378906 36.953125 89.207031 24.59375 24.59375 56.902344 36.890625 89.207031 36.890625 32.308594 0 64.613282-12.296875 89.210938-36.890625l119.230468-119.234375zm0 0"/></svg>
                                                    <span>{e}</span>
                                                </li>
                                            })

                                            :
                                            <li className={'noResultLi'}>
                                                <span>Hiç sonuç bulamadık</span>
                                            </li>
                                    }

                                    { this.state.searchResults.length >= 11 ? this.state.searchResults.length != this.state.newData.length && <li className={'moreLi'}>
                                        <Button onMouseDown={this.handleMore} color="primary"><span>Daha fazla</span></Button>
                                    </li> : '' }
                                </ul>
                            </div>



                        </div>

                    </div>

                    {
                        <div id={'selectedItems'}>

                            {this.state.selectedItems.map((e) => {
                                return <Chip
                                    label={e}
                                    onClick={() => {}}
                                    onDelete={() => {}}
                                    style={{backgroundColor:'#ececec', marginRight:10}}
                                    size={'small'}
                                />
                            })}


                        </div>
                    }

                    {
                        (this.state.newData.length == 0 || this.state.searchKey.trim() == '') && <div id={'helperTexts'}>
                            <div className={'infoText'}>
                                <p><b>Ne işe yarar?</b></p>
                                <p>İlaçların veya gıdaların etken maddelerinin beraber tüketilmeleri durumunda oluşacak etkilerini sonuçlar</p>
                            </div>
                            <div className={'infoText'}>
                                <p><b>Nasıl kullanılır?</b></p>
                                <p>Arama çubuğuna etken maddeleri yazarak başlayabilirsin</p>
                            </div>
                        </div>
                    }



                </div>

            </main>

            <footer className={'row mr-0 ml-0 menu'} id={'bottom'}>

                <div className={'col-lg-12 p-0 menuArea'}>
                    <ul>
                        <li>
                        <span className={'link'}>
                          <a href={''} >Şartlar</a>
                        </span>
                        </li>
                        <li>
                        <span className={'link'}>
                          <a href={''} >Bağışta bulun</a>
                        </span>
                        </li>
                    </ul>
                </div>

            </footer>

        </div>
    );
  }
}

