import axios from "axios";
import { parseCookies } from 'nookies'
import { toast } from "react-toastify";
import { SignInData } from "../@types/user";

const { 'auth.token': token } = parseCookies()

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASEURL
})

// Inserir o Token no Header das requisições
if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`


// api.interceptors.request.use(config => {
//     return config
// })

// to send the password user by the email
// using SendGridAPI (50 emails/day) (Basic Plan)
export const sendEmailApi = async (sendEmailProps: SignInData) => {
    const options = {
        method: 'POST',
        url: 'https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': import.meta.env.VITE_XRAPID_API_KEY,
            'X-RapidAPI-Host': import.meta.env.VITE_XRAPID_API_HOST_SENDGRID
        },
        data: `{"personalizations":[{"to":[{"email":"${sendEmailProps.email}"}],"subject":"Sua senha!"}],"from":{"email":"mercadinhoServices@gmail.com"},"content":[{"type":"text/plain","value":"Ooi, tudo bom?? Sua senha é ${sendEmailProps.password}"}]}`
    }

    // Precisa da extensão do chrome de Allow CORS: Access-Control-Allow-Origin
    axios.request(options)
        .then(res => {
            toast.success('Email enviado com sucesso! Lembre de verificar o spam :)')
            // console.log(res)
        })
        .catch(err => {
            toast.error('Algo deu errado ao enviar o email :(')
            console.log(err)
        })
};

// to get product data
// using Barcode Lookup API (10/month requests) (Basic Plan)
export const getProductList = async (search: string, title: string, category: string) => {
    const options = {
        method: 'GET',
        url: 'https://barcode-lookup.p.rapidapi.com/v3/products',
        params: { search, title, category },
        headers: {
            'X-RapidAPI-Key': import.meta.env.VITE_XRAPID_API_KEY,
            'X-RapidAPI-Host': import.meta.env.VITE_XRAPID_API_HOST_BARCODELOOKUP
        }
    };

    axios.request(options)
        .then(res => {
            console.log(res.data);
        }).catch(err => {
            console.error(err);
        });
}

// to get product data
// using Barcodes API (500/month requests) (Basic Plan)
export const getProductList2 = async (query: string) => {
    const options = {
        method: 'GET',
        url: 'https://barcodes1.p.rapidapi.com/',
        params: { query },
        headers: {
            'X-RapidAPI-Key': import.meta.env.VITE_XRAPID_API_KEY,
            'X-RapidAPI-Host': import.meta.env.VITE_XRAPID_API_HOST_BARCODES
        }
    };

    axios.request(options)
        .then(res => {
            console.log(res.data);
        }).catch(err => {
            console.error(err);
        });
}
